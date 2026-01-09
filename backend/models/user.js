import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true, // optional for Google users (handled in controller)
    },

    phoneNumber: {
      type: String,
    },

    profilePicture: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite error in dev / nodemon
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
