import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import sendMail from "../utils/sendMail.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await sendMail(email, otp);

    res.status(201).json({
      message: "Registration successful. Verify OTP.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= RESEND OTP ================= */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMail(email, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE PROFILE (CRITICAL FIX) ================= */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { firstName, lastName, phoneNumber, email } = req.body;

    const updates = {
      firstName,
      lastName,
      phoneNumber,
      email,
    };

    // 🟢 Save Cloudinary image URL
    if (req.file && req.file.path) {
      updates.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },   // 🔥 THIS FIXES YOUR BUG
      { new: true }
    ).select("firstName lastName email phoneNumber profileImage");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
};

/* ================= GET LOGGED IN USER ================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "firstName lastName email phoneNumber profileImage"
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to load user" });
  }
};
