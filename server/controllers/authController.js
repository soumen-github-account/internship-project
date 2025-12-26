
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js';
import transporter from '../config/nodemailer.js';
import { PASSWORD_RESET_TEMPLATE, welcomeEmailTemplate } from '../config/emailTemplate.js';
import crypto from "crypto";

export const googleLogin = (req, res) =>{
    res.send("Redirecting to Google...");
}

export const googleCallback = (req, res)=>{
    if(!req.user) return res.redirect(`${process.env.CLIENT_URL}/login`)
    
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect(process.env.CLIENT_URL);
}

export const loginFailure = (req, res) => {
  res.status(401).json({ success: false, message: "Failed to authenticate with Google" });
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({ success: true, user });

    await transporter.sendMail({
      from: `"Worksphere" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: `Welcome to Worksphere 🎉`,
      html: welcomeEmailTemplate({
        websiteName: "Worksphere",
        websiteLogo: `${process.env.BASE_URL}/public/images/logo.jpeg`,
        userName: user.name || "User",
        loginUrl: `${process.env.BASE_URL}/login`
      })
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.password)
      return res.status(400).json({ success: false, message: "Please login with Google" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,  
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const logout = async(req, res)=>{
  res.clearCookie("token");
  res.json({success: true});
}

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOtp = hashedOtp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"Worksphere" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    });

    req.session.email = email;       
    req.session.otpVerified = false;
    res.render("auth/reset-password", { step: "otp", email });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { email } = req.session;
  const { otp } = req.body;

  if (!email || !otp) return res.json({ success: false, message: "Email and OTP required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !user.resetOtp) return res.json({ success: false, message: "OTP not requested" });

    if (user.resetOtpExpireAt < Date.now()) return res.json({ success: false, message: "OTP expired" });

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== user.resetOtp) return res.json({ success: false, message: "Invalid OTP" });

    req.session.otpVerified = true;
    res.render("auth/reset-password", { step: "new-password", email });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otpVerified } = req.session;
  const { newPassword } = req.body;

  if (!email || !otpVerified) return res.json({ success: false, message: "OTP not verified" });
  if (!newPassword) return res.json({ success: false, message: "New password is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpireAt = undefined;
    await user.save();

    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};