import express from "express"
import { protect } from "../middleware/authMiddleware.js";
import { getUser, renderMyApplications, subscribed } from "../controllers/userController.js";

import { applyForJob } from "../controllers/applicationController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/get-user", protect, getUser);
userRouter.post("/apply", protect, upload.single("resume"), applyForJob);
userRouter.get("/myApplications", protect, renderMyApplications);
userRouter.post("/subscribed", protect, subscribed);

export default userRouter;