import bcrypt from "bcryptjs";
import User from "../models/user.js";
import sendMail from "../utils/sendMail.js";

/* SEND OTP FOR PASSWORD RESET */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendMail(emailLower, otp);

    res.json({
      message: "Password reset OTP sent"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ OTP must be verified, but email stays verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "OTP not verified" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = null;
    user.otpExpires = null;


    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
