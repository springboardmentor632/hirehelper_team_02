import express from "express";
import {
  register,
  sendOtp,
  verifyOtp,
  login,
  resendOtp,
  updateProfile,
  getMe
} from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadToCloudinary from "../middleware/uploadMiddleware.js";
import { forgotPassword, resetPassword } from "../controllers/passwordControllers.js";

const router = express.Router();

/* AUTH */
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/resend-otp", resendOtp);

/* PASSWORD */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* PROFILE */
router.put(
  "/update-profile",
  authMiddleware,
  uploadToCloudinary("profile_pictures").single("profileImage"),
  updateProfile
);

/* 🔥 THIS WAS MISSING */
router.get("/me", authMiddleware, getMe);

export default router;
