import express from "express";
import { register, verifyOtp, login } from "../controllers/authControllers.js";
import { forgotPassword, resetPassword } from "../controllers/passwordControllers.js";
import { sendOtp } from "../controllers/otp_controller.js";

const router = express.Router();

/* Auth */
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

/* OTP */
router.post("/send-otp", sendOtp);

/* Password */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
