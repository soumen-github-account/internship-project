import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  companyId:{
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  logo: String,
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);
