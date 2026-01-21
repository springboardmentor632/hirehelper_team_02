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
      required: true,
    },

    passwordUpdatedAt: {
      type: Date,
      default: null
    },

    phoneNumber: {
      type: String,
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    address: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: String,
    otpExpires: Date,

    // ✅ ADD THIS
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", userSchema);
