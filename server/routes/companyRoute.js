import express from 'express'
import { admin_logout, companyLogin, companySignup, createJob, deleteJob, editJobPage, getAllJobs, getAllJobsByCompanyId, getCompanyApplications, getJobById, updateApplicationStatus, updateJob } from '../controllers/adminController.js';
import upload from '../middleware/multer.js';
import { AdminProtect } from '../middleware/authMiddleware.js';

const companyRouter = express.Router();

companyRouter.get("/login", (req, res) => {
  if (req.cookies.adminToken) {
    return res.redirect("/company/dashboard");
  }
  res.render("companyView/companyLogin");
});

companyRouter.post("/login", companyLogin);
companyRouter.post("/logout", AdminProtect, admin_logout);

companyRouter.post("/signup", upload.single("logo"), companySignup);

companyRouter.get("/post-job", (req, res) => {
  res.render("companyView/post-job");
});

companyRouter.post("/create", AdminProtect, upload.single("companyLogo"), createJob);
companyRouter.get("/jobs", getAllJobs);
companyRouter.get("/jobs/:jobId", getJobById);

companyRouter.get("/get-all-jobs", AdminProtect, getAllJobsByCompanyId);
companyRouter.get("/dashboard", AdminProtect, getCompanyApplications);

companyRouter.patch("/applications/:id/status", AdminProtect, updateApplicationStatus);

companyRouter.get("/jobs/:jobId/edit", AdminProtect, editJobPage);

companyRouter.post("/jobs/:jobId/edit", AdminProtect, upload.single("companyLogo"), updateJob);

companyRouter.post("/jobs/:jobId/delete", AdminProtect, deleteJob);

export default companyRouter;