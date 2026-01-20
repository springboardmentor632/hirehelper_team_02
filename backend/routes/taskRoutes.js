import express from "express";
import {
  createTask,
  getMyTasks,
  getTaskFeed,
} from "../controllers/taskController.js";
import { deleteTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadToCloudinary from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* TEST */
router.get("/test", (req, res) => {
  res.json({ message: "Task API working" });
});

/**
 * CREATE TASK (with optional image)
 * POST /api/tasks
 */
router.post(
  "/",
  authMiddleware,
  uploadToCloudinary("tasks").single("image"),
  createTask
);

/**
 * GET MY TASKS
 * GET /api/tasks/my
 */
router.get("/my", authMiddleware, getMyTasks);

/**
 * GET TASK FEED
 * GET /api/tasks/feed
 */
router.get("/feed", authMiddleware, getTaskFeed);
router.delete("/:id", authMiddleware, deleteTask);


export default router;
