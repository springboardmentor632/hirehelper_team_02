import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/:id/read", authMiddleware, markAsRead);
router.patch("/mark-all-read", authMiddleware, markAllAsRead);

export default router;
