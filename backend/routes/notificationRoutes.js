import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markAsRead
} from "../controllers/notificationController.js";

const router = express.Router();


   //GET NOTIFICATIONS

router.get("/", authMiddleware, getNotifications);


   //MARK AS READ

router.put("/:id/read", authMiddleware, markAsRead);

export default router;
