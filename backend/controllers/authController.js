import User from "../models/User.js";
import bcrypt from "bcryptjs";

// REGISTER + OTP
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email_id, phone_number, password } = req.body;

    const userExists = await User.findOne({ email_id });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    const user = await User.create({
      first_name,
      last_name,
      email_id,
      phone_number,
      password: hashedPassword,
      otp,
      otp_expiry
    });

    console.log("OTP for verification:", otp);

    res.status(201).json({
      success: true,
      message: "User registered. Verify OTP",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otp_expiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    res.json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const user = await User.findOne({ email_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp) {
      return res.status(401).json({ message: "OTP not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_id: user.email_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};