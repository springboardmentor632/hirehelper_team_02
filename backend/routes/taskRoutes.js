import express from "express";
import {
  createTask,
  getMyTasks,
  getTaskFeed,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

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
  upload.single("image"), // image field name
  createTask
);

/**
 * GET MY TASKS
 * GET /api/tasks/my
 */
router.get("/my", authMiddleware, getMyTasks);

/**
 * GET TASK FEED (other users' tasks)
 * GET /api/tasks/feed
 */
router.get("/feed", authMiddleware, getTaskFeed);

router.get("/", authMiddleware, getTaskFeed);


export default router;
