import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email_id: { type: String, unique: true },
  phone_number: String,
  password: String,
  otp: String,
  otp_expiry: Date,
  profile_picture: String
});

const User = mongoose.model("User", userSchema);

export default User;