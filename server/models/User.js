import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    picture: {type: String, default:""},

    resetOtp: {type: String, default:''},
    resetOtpExpireAt: {type: Number, default:0},

}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);