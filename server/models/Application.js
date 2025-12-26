import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    resume: {
      type: String, // resume file URL
      required: true,
    },

    coverLetter: {
      type: String,
    },

    status: {
      type: String,
      enum: ["applied", "reviewing", "accepted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model(
  "Application",
  applicationSchema
);
