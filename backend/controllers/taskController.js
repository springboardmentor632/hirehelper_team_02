import Task from "../models/Task.js";

/* =========================
   CREATE TASK
========================= */
export const createTask = async (req, res) => {
  try {
    // 🔐 AUTH CHECK
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized: Please login again",
      });
    }

    const {
      title,
      description,
      location,
      startDate,   // 🔥 REQUIRED from frontend
      startTime,   // "09:30"
      endDate,     // 🔥 REQUIRED from frontend
      endTime,     // "16:30"
      category,
    } = req.body;

    // ✅ REQUIRED FIELD VALIDATION
    if (!title || !description || !location || !startDate || !startTime) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // 🔥 COMBINE DATE + TIME → VALID DATE OBJECTS
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = endDate && endTime
      ? new Date(`${endDate}T${endTime}`)
      : null;

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
      category: category?.trim() ? category : "General",
      startTime: startDateTime,      // ✅ Date
      endTime: endDateTime,          // ✅ Date or null
      image: req.file ? req.file.path : null,
      createdBy: req.user._id,
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
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

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
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

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
