import bcrypt from "bcryptjs";
import User from "../models/user.js";
import sendMail from "../utils/sendMail.js";

/* ================= FORGOT PASSWORD (SEND OTP) ================= */
export const forgotPassword = async (req, res) => {
  try {
    console.log("🔥 FORGOT PASSWORD API HIT");

    const { email } = req.body;
    if (!email) {
      console.log("❌ Email missing in request");
      return res.status(400).json({ message: "Email is required" });
    }

    const emailLower = email.toLowerCase();
    console.log("📧 Email received:", emailLower);

    const user = await User.findOne({ email: emailLower });
    if (!user) {
      console.log("❌ User not found for:", emailLower);
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔥 FORCE TERMINAL LOG (THIS WILL ALWAYS SHOW)
    console.log("======================================");
    console.log("🔐 FORGOT PASSWORD OTP GENERATED");
    console.log("👤 User :", emailLower);
    console.log("🔢 OTP  :", otp);
    console.log("======================================");

    // Save OTP
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email (email may succeed/fail — does NOT affect terminal log)
    await sendMail(emailLower, otp);

    return res.status(200).json({
      message: "Forgot password OTP generated",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD (VERIFY OTP) ================= */
export const resetPassword = async (req, res) => {
  try {
    console.log("🔁 RESET PASSWORD API HIT");

    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp) {
      return res.status(400).json({ message: "No OTP requested" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    console.log("✅ Password reset successful for:", user.email);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
