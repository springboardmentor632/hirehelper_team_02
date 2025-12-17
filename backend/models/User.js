const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    // REQUIRED to satisfy MongoDB unique index
    email: {
      type: String,
      unique: true,
      sparse: true   // allows null safely if needed
    },

    // Used by application logic
    email_id: {
      type: String,
      required: true,
      unique: true
    },

    phone: {
      type: String
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["customer", "worker"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
