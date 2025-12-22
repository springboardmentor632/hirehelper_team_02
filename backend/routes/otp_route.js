import express from "express";
import { sendOtp, resetPassword } from "../controllers/otp_controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);

export default router;
