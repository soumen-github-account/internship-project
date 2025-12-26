import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Company } from "../models/Company.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ success: false, message: "Not authenticated, login now !" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    req.user = user; // IMPORTANT
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const AdminProtect = async (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) return res.redirect("/company/login");

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    const company = await Company.findById(decoded.id).select("-password");
    if (!company) return res.redirect("/company/login");

    req.company = company;
    next();
  } catch {
    return res.redirect("/company/login");
  }
};
