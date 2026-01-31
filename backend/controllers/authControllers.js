import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import sendMail from "../utils/sendMail.js";
import cloudinary from "../config/cloudinary.js";

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
      profileImage: "",
    });

    await sendMail(email, otp);

    res.status(201).json({ message: "Registration successful. Verify OTP." });
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

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    // ✅ CREATE TOKEN (AUTO LOGIN)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "OTP verified successfully",
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

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body; // 🔥 receive remember flag

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🔥 Token expiry depends on Remember Me
    const tokenExpiry = remember ? "30d" : "1d";

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

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
        passwordUpdatedAt: user.passwordUpdatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= RESEND OTP ================= */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

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

/* ================= GET LOGGED IN USER ================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "firstName lastName email phoneNumber bio profileImage"
    );
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "Failed to load user" });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      bio,                   // 🔥 added
      removeProfileImage
    } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;   // 🔥 save bio (important)

    // 🟢 Upload new image
    if (req.file) {
      if (user.profileImage) {
        const publicId = user.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      user.profileImage = req.file.path;
    }

    // 🔴 Remove image
    if (removeProfileImage === "true" && user.profileImage) {
      const publicId = user.profileImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
      user.profileImage = "";
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        bio: user.bio,        // 🔥 return bio
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: "New password must be different" });
    }

    // 🔥 Save new password
    user.password = await bcrypt.hash(newPassword, 10);

    // 🔥 THIS IS THE MISSING LINE
    user.passwordUpdatedAt = new Date();

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
      passwordUpdatedAt: user.passwordUpdatedAt, // send back
    });
  } catch (error) {
    res.status(500).json({
      message: "Password update failed",
      error: error.message,
    });
  }
};
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);
    res.status(500).json({ message: "Account deletion failed" });
  }
};

