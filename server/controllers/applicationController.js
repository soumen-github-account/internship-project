
import cloudinary from "../config/cloudinary.js";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";

/* =========================
   CLOUDINARY UPLOAD HELPER
========================= */
export const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType =
      mimetype === "application/pdf" ? "raw" : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "resumes",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

/* =========================
   APPLY FOR JOB CONTROLLER
========================= */
export const applyForJob = async (req, res) => {
  try {
    const { jobId, fullName, email, phone, coverLetter } = req.body;
    const file = req.file;

    /* ---------- VALIDATION ---------- */
    if (!jobId || !fullName || !email || !phone) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    if (!file) {
      return res.status(400).json({
        message: "Resume is required",
      });
    }

    /* ---------- FIND JOB ---------- */
    const job = await Job.findOne({ jobId });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    /* ---------- PREVENT DUPLICATE APPLY ---------- */
    const alreadyApplied = await Application.findOne({
      user: req.user._id,
      job: job._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    /* ---------- UPLOAD RESUME ---------- */
    const uploaded = await uploadToCloudinary(
      file.buffer,
      file.mimetype
    );

    /* ---------- CREATE APPLICATION ---------- */
    const application = await Application.create({
      user: req.user._id,
      job: job._id,
      fullName,
      email,
      phone: phone.toString(), // safer than Number
      resume: uploaded.secure_url,
      coverLetter,
    });

    /* ---------- UPDATE JOB ---------- */
    job.applicants = (job.applicants || 0) + 1;

    // 🔴 ensure this field name exists in Job schema
    job.applications = job.applications || [];
    job.applications.push(application._id);

    await job.save();

    /* ---------- RESPONSE ---------- */
    res.status(201).json({
      success: true,
      message: "Applied successfully",
    });

  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({
      message: "Application failed",
    });
  }
};
