import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for Google users
    phoneNumber: String,
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

// VERY IMPORTANT: use exact model name "User"
export default mongoose.models.User ??
  mongoose.model("User", userSchema);
