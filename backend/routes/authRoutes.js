import express from "express";

/* CONTROLLERS */
import {
  register,
  sendOtp,
  verifyOtp,
  login,
  resendOtp,
  updateProfile,
  getMe,
  changePassword,
  deleteAccount,
} from "../controllers/authControllers.js";

import {
  forgotPassword,
  resetPassword,
} from "../controllers/passwordControllers.js";

/* MIDDLEWARE */
import authMiddleware from "../middleware/authMiddleware.js";
import uploadToCloudinary from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/resend-otp", resendOtp);

/* ================= PASSWORD ================= */
// NO authMiddleware here
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//Logged-in users only
router.put("/change-password", authMiddleware, changePassword);

/* ================= PROFILE ================= */
router.get("/me", authMiddleware, getMe);

router.put(
  "/update-profile",
  authMiddleware,
  uploadToCloudinary("profile_pictures").single("profileImage"),
  updateProfile
);

router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
