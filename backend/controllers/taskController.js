import Task from "../models/Task.js";
import Request from "../models/Request.js";

/* =========================
   CREATE TASK
========================= */
export const createTask = async (req, res) => {
  try {
    // 🔐 AUTH CHECK
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: Please login again",
      });
    }

    // ✅ SUPPORT BOTH id AND _id FROM JWT
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid user session",
      });
    }

    const {
      title,
      description,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
      category,
    } = req.body;

    // ✅ REQUIRED FIELD VALIDATION
    if (!title || !description || !location || !startDate || !startTime) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // 🔥 COMBINE DATE + TIME
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime =
      endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

    // ❌ INVALID DATE CHECK
    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({
        message: "Invalid start date or time",
      });
    }

    if (endDateTime && isNaN(endDateTime.getTime())) {
      return res.status(400).json({
        message: "Invalid end date or time",
      });
    }

    // ⏰ TIME VALIDATION
    if (endDateTime && startDateTime > endDateTime) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    // 📝 CREATE TASK
    const task = await Task.create({
      title,
      description,
      location,
      category: category?.trim() || "General",
      startTime: startDateTime,
      endTime: endDateTime,
      image: req.file ? req.file.path : null,
      createdBy: userId,
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
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id || req.user._id;

    const tasks = await Task.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

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
    const userId = req.user._id;

    const tasks = await Task.find({
      createdBy: { $ne: userId },
    })
      .populate("createdBy", "firstName profileImage")
      .sort({ createdAt: -1 });

    const requests = await Request.find({ requester: userId });
    const requestedTaskIds = requests.map(r => r.task.toString());

    const tasksWithRequestStatus = tasks.map(task => ({
      ...task.toObject(),
      isRequested: requestedTaskIds.includes(task._id.toString())
    }));

    res.status(200).json(tasksWithRequestStatus);
  } catch (error) {
    console.error("GET TASK FEED ERROR:", error);
    res.status(500).json({ message: "Failed to fetch task feed" });
  }
};


// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id || req.user._id;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 Only task owner can delete (FIXED)
    if (task.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this task",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
};
