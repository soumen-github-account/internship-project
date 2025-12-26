import express from "express";
import passport from "../config/passport.js"
import { googleCallback, login, loginFailure, logout, resetPassword, sendResetOtp, signup, verifyResetOtp } from "../controllers/authController.js";

const router = express.Router();

// ================= Google OAuth =================

// Step 1: Start Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login/failure" }),
  googleCallback
);

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// ================= Other routes =================
router.get("/login/failure", loginFailure);
router.post("/logout", logout);

// router.post('/send-reset-otp', sendResetOtp);
// router.post('/reset-password', restePassword);
// router.post("/send-reset-otp", sendResetOtp);
// router.post("/verify-reset-otp", verifyResetOtp);
// router.post("/reset-password", resetPassword);
router.get("/reset-password", (req, res) => {
  res.render("auth/reset-password", { step: "email", email: null });
});

router.post("/reset-password/email", sendResetOtp);
router.post("/reset-password/otp", verifyResetOtp);
router.post("/reset-password/new", resetPassword);
export default router;
