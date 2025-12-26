
import cloudinary from "../config/cloudinary.js";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";

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

export const applyForJob = async (req, res) => {
  try {
    const { jobId, fullName, email, phone, coverLetter } = req.body;
    const file = req.file;

    if (!jobId || !fullName || !email || !phone) {
      return res.status(400).json({message: "All required fields must be filled"});
    }

    if (!file) {
      return res.status(400).json({message: "Resume is required"});
    }

    const job = await Job.findOne({ jobId });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({user: req.user._id, job: job._id});

    if (alreadyApplied) {
      return res.status(400).json({message: "You have already applied for this job"});
    }

    const uploaded = await uploadToCloudinary(
      file.buffer,
      file.mimetype
    );

    const application = await Application.create({
      user: req.user._id,
      job: job._id,
      fullName,
      email,
      phone: phone.toString(), 
      resume: uploaded.secure_url,
      coverLetter,
    });

    job.applicants = (job.applicants || 0) + 1;

    job.applications = job.applications || [];
    job.applications.push(application._id);

    await job.save();

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
