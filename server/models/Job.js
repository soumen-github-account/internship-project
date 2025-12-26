
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyId: {type: String, required:true, unique: true},
    jobId: { type: String, required: true, unique: true },

    title: String,
    category: String,

    companyName: String,
    companyType: String,
    companyLogo: String,

    companyAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    location: String,
    duration: String,
    stipend: String,
    startDate: String,
    applyBy: String,
    postedDaysAgo: Number,
    jobType: String,

    applicants: { type: Number, default: 0 },
    openings: Number,

    aboutWork: [String],
    skillsRequired: [String],
    perks: [String],
    whoCanApply: [String],

    aboutCompany: {
      description: String,
      hiringSince: String,
      opportunitiesPosted: Number,
      candidatesHired: Number,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
