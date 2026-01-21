import bcrypt from "bcryptjs";
import User from "../models/user.js";
import sendMail from "../utils/sendMail.js";

/* ================= FORGOT PASSWORD (SEND OTP) ================= */
export const forgotPassword = async (req, res) => {
  try {
    console.log("🔥 FORGOT PASSWORD API HIT");

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("======================================");
    console.log("🔐 FORGOT PASSWORD OTP GENERATED");
    console.log("👤 User :", emailLower);
    console.log("🔢 OTP  :", otp);
    console.log("======================================");

    // Save OTP + reset verification state
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.otpVerified = false;
    await user.save();

    // Send OTP email
    await sendMail(emailLower, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    console.log("🔐 VERIFY OTP API HIT");

    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Mark OTP as verified
    user.otpVerified = true;
    await user.save();

    console.log("✅ OTP verified for:", user.email);

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD (NO OTP CHECK) ================= */
export const resetPassword = async (req, res) => {
  try {
    console.log("🔁 RESET PASSWORD API HIT");

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚨 OTP must be verified before reset
    if (!user.otpVerified) {
      return res.status(403).json({ message: "OTP not verified" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordUpdatedAt = new Date();

    // Cleanup OTP data
    user.otp = null;
    user.otpExpires = null;
    user.otpVerified = false;

    await user.save();

    console.log("✅ Password reset successful for:", user.email);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
