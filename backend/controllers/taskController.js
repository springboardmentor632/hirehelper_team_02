import Task from "../models/Task.js";

/* =========================
   CREATE TASK
========================= */
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startTime,
      endTime,
      category,
    } = req.body;

    // 🔴 Required field validation
    if (!title || !description || !location || !startTime) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // 🔴 Time validation
    if (endTime && new Date(startTime) > new Date(endTime)) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    // 🔥 Create task
    const task = await Task.create({
      title,
      description,
      location,
      category: category || "General",
      startTime,
      endTime: endTime || null,
      image: req.file ? req.file.path : null, // ✅ Cloudinary URL
      createdBy: req.user._id, // ✅ From authMiddleware
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

/* =========================
   GET MY TASKS
========================= */
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("GET MY TASKS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

/* =========================
   GET TASK FEED
========================= */
export const getTaskFeed = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: { $ne: req.user._id },
    })
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("GET TASK FEED ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch task feed",
    });
  }
};
