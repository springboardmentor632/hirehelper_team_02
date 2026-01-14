// Load env FIRST
import "./loadEnv.js";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otp_route.js";
import taskRoutes from "./routes/taskRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Connect MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/auth", otpRoutes);   // keep if OTP routes exist
app.use("/api/tasks", taskRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("HireHelper Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
