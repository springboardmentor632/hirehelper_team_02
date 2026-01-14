import express from "express";
import {
  register,
  sendOtp,
  verifyOtp,
  login,
  resendOtp,
  updateProfile,
  getMe,
  changePassword,
} from "../controllers/authControllers.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadToCloudinary from "../middleware/uploadMiddleware.js";
import { forgotPassword, resetPassword } from "../controllers/passwordControllers.js";
import { deleteAccount } from "../controllers/authControllers.js";


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
router.put("/change-password", authMiddleware, changePassword);

/* PROFILE */
router.get("/me", authMiddleware, getMe);

router.put(
  "/update-profile",
  authMiddleware,
  uploadToCloudinary("profile_pictures").single("profileImage"),
  updateProfile
);
router.delete("/delete-account", authMiddleware, deleteAccount);


export default router;
