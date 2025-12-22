import User from "../models/user.js";
import bcrypt from "bcryptjs";
import sendMail from "../utils/sendMail.js";

// SEND OTP (Forgot Password)
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMail(emailLower, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
