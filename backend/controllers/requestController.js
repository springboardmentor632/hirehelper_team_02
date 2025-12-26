import Request from "../models/Request.js";
import Task from "../models/Task.js";

export const createRequest = async (req, res) => {
  try {
    const task = await Task.findById(req.body.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const request = await Request.create({
      taskId: task._id,
      requestedBy: req.user._id,
      owner: task.createdBy,
      message: req.body.message,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
