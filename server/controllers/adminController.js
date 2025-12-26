import cloudinary from "../config/cloudinary.js";
import { Job } from "../models/Job.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Company } from "../models/Company.js";
import { Application } from "../models/Application.js";
import { Subscriber } from "../models/Subcribers.js";
import transporter from '../config/nodemailer.js';

const logoUrl = `${process.env.BASE_URL}/public/images/logo.jpeg`;

export const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType =
      mimetype === "application/pdf" ? "raw" : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "companyLogos",
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

export const companySignup = async (req, res) => {
  try {
    const { name, email, password, companyId } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.redirect("/admin/signup");
    }
    const file = req.file;
    if(!file){
      return res.status(404).json({
        message: "Logo is required",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const uploaded = await uploadToCloudinary(
      file.buffer,
      file.mimetype
    );
    const company = await Company.create({
      name,
      email,
      companyId,
      password: hashedPassword,
      logo: uploaded.secure_url
    });

    res.redirect("/company/signup");

  } catch (error) {
    console.error(error);
    res.redirect("/admin/signup");
  }
};

export const companyLogin = async (req, res) => {
  try {
    const { companyId, password } = req.body;

    const company = await Company.findOne({ companyId });
    if(!company) return res.json({ success: false, message: "Company not found" });

    const isMatch = await bcrypt.compare(password, company.password);
    if(!isMatch) return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: company._id }, process.env.ADMIN_JWT_SECRET, { expiresIn: "1d" });

    res.cookie("adminToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24*60*60*1000
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
};


export const admin_logout = (req, res) => {
  res.clearCookie("adminToken");
  res.json({ success: true, message: "Admin logged out" });
};


export const createJob = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "company_logos" }, (error, uploadResult) => {
          if (error) reject(error);
          resolve(uploadResult);
        })
        .end(req.file.buffer);
    });

    const {
      jobId,
      title,
      category,
      jobType,
      companyName,
      companyType,

      street,
      city,
      state,
      country,
      pincode,

      location,
      duration,
      stipend,
      startDate,
      applyBy,
      openings,

      aboutWork,
      skillsRequired,
      perks,
      whoCanApply,

      hiringSince,
      opportunitiesPosted,
      candidatesHired,
      companyDescription,
    } = req.body;

    const job = await Job.create({
      companyId: req.company.companyId,
      jobId,
      title,
      category,
      jobType,

      companyName,
      companyType,
      companyLogo: result.secure_url,

      companyAddress: {
        street,
        city,
        state,
        country,
        pincode,
      },

      location,
      duration,
      stipend,
      startDate,
      applyBy,
      openings,

      aboutWork: aboutWork?.split(",").map(i => i.trim()),
      skillsRequired: skillsRequired?.split(",").map(i => i.trim()),
      perks: perks?.split(",").map(i => i.trim()),
      whoCanApply: whoCanApply?.split(",").map(i => i.trim()),

      aboutCompany: {
        description: companyDescription,
        hiringSince,
        opportunitiesPosted,
        candidatesHired,
      },
    });
    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });

    const subscribers = await Subscriber.find({
      isActive: true,
      email: { $exists: true }
    }).select("email");

    if (subscribers.length > 0) {
      const emails = subscribers.map(s => s.email);

      await transporter.sendMail({
        from: `"Worksphere" <${process.env.SENDER_EMAIL}>`,
        to: emails,
        subject: `New Job at ${job.companyName}`,
        html: JOB_POSTED_EMAIL_TEMPLATE({
          websiteName: "Worksphere",
          websiteLogo: logoUrl,
          jobTitle: job.title,
          companyName: job.companyName,
          companyLogo: job.companyLogo,
          location: job.location,
          stipend: job.stipend,
          aboutWork: job.aboutWork,
          skills: job.skillsRequired,
          perks: job.perks,
          applyUrl: `/jobs/${job._id}`
        })
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get all jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({ jobId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const postedDate = new Date(job.createdAt);
    const today = new Date();

    const different = today - postedDate;
    const postedDaysAgo = Math.floor(different / (1000 * 60 * 60 * 24));

    res.render("userView/job-details", {
      job,
      postedDaysAgo: postedDaysAgo === 0 ? "Today" : postedDaysAgo
    });
  } catch (error) {
    console.error("Get job by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

export const getAllJobsByCompanyId = async (req, res) => {
  try {
    const jobs = await Job.find({
      companyId: req.company.companyId
    }).sort({ createdAt: -1 });

    res.render("companyView/AllJobs", {
      company: req.company,
      jobs,
      count: jobs.length
    });

  } catch (error) {
    console.error("Get all jobs error:", error);
    res.status(500).render("error", {
      message: "Failed to fetch jobs"
    });
  }
};



export const getCompanyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      companyId: req.company.companyId
    }).select("_id");

    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({
      job: { $in: jobIds }
    })
      .populate("job", "title")
      .sort({ createdAt: -1 });

    const total = applications.length;
    const pending = applications.filter(a => a.status === "applied").length;
    const accepted = applications.filter(a => a.status === "accepted").length;

    res.render("companyView/dashboard", {
      company: req.company,
      applications,
      total,
      pending,
      accepted
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};



export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!["applied", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (application.job.companyId !== req.company.companyId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: "Status updated"
    });

  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const editJobPage = async (req, res) => {
  try {
    const job = await Job.findOne({
      jobId: req.params.jobId,
      companyId: req.company.companyId
    });

    if (!job) {
      return res.status(404).send("Job not found");
    }

    res.render("companyView/edit-job", {
      company: req.company,
      job
    });

  } catch (error) {
    console.error("Edit job page error:", error);
    res.status(500).send("Server error");
  }
};

export const updateJob = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "company_logos" }, (error, uploadResult) => {
          if (error) reject(error);
          resolve(uploadResult);
        })
        .end(req.file.buffer);
    });

    const job = await Job.findOne({
      jobId: req.params.jobId,
      companyId: req.company.companyId
    });

    if (!job) {
      return res.status(404).send("Job not found");
    }

    const updatableFields = [
      "title",
      "category",
      "location",
      "duration",
      "stipend",
      "jobType",
      "openings",
      "applyBy"
    ];

    updatableFields.forEach(field => {
      if (req.body[field] && req.body[field] !== "") {
        job[field] = req.body[field];
      }
    });
    if (req.file) {
      job.companyLogo = result.secure_url;
    }

    await job.save();

    res.redirect("/company/get-all-jobs");

  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).send("Update failed");
  }
};


export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({ jobId });

    if (!job) {
      return res.status(404).render("error", {
        message: "Job not found"
      });
    }
    if (job.companyId !== req.company.companyId) {
      return res.status(403).render("error", {
        message: "Unauthorized access"
      });
    }
    await Job.deleteOne({ jobId });

    res.redirect("/company/get-all-jobs");

  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).render("error", {
      message: "Failed to delete job"
    });
  }
};
