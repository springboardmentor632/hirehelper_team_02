import Request from "../models/Request.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";

/* =========================
   CREATE REQUEST (Helper)
========================= */
export const createRequest = async (req, res) => {
  try {
    const { taskId, message } = req.body;
    const requestedBy = req.user.id || req.user._id;

    // 🔍 Find task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ❌ Prevent owner requesting own task
    if (task.createdBy.toString() === requestedBy.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot request your own task" });
    }

    // ❌ Prevent duplicate request
    const existingRequest = await Request.findOne({
      taskId,
      requestedBy,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Request already sent" });
    }

    // ✅ Create request
    const request = await Request.create({
      taskId,
      requestedBy,
      owner: task.createdBy,
      message,
      status: "pending",
    });

    // 🔔 Notification → Task Owner (store sender)
    await Notification.create({
      user: task.createdBy,
      sender: requestedBy,              // ✅ who sent it
      message: "You received a new request on your task",
      isRead: false,
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET REQUESTS RECEIVED (Owner)
========================= */
export const getRequestsForMyTasks = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;

    const requests = await Request.find({ owner: ownerId })
      .populate("taskId", "title location")
      .populate("requestedBy", "firstName lastName email profileImage")
      .sort({ createdAt: -1 });

    // 🔥 Normalized response for frontend
    const formattedRequests = requests.map((r) => ({
      _id: r._id,
      status: r.status,
      createdAt: r.createdAt,
      message: r.message,

      requester: {
        _id: r.requestedBy?._id,
        firstName: r.requestedBy?.firstName,
        lastName: r.requestedBy?.lastName,
        email: r.requestedBy?.email,
        profileImage: r.requestedBy?.profileImage,   // ✅ FIXED
      },

      task: {
        _id: r.taskId?._id,
        title: r.taskId?.title,
        location: r.taskId?.location,
      },
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error("GET OWNER REQUESTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET MY REQUESTS (Helper)
========================= */
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const requests = await Request.find({ requestedBy: userId })
      .populate("taskId", "title location")
      .populate("owner", "firstName lastName email profileImage") // ✅ added photo
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("GET MY REQUESTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ACCEPT / REJECT REQUEST (Owner)
========================= */
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 🔐 Only owner can accept/reject
    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    request.status = status;
    await request.save();

    // 🔔 Notification → Helper (store sender)
    await Notification.create({
      user: request.requestedBy,
      sender: req.user._id,          // ✅ who responded
      message:
        status === "accepted"
          ? "Your request has been accepted"
          : "Your request has been rejected",
      isRead: false,
    });

    res.status(200).json({
      message: `Request ${status}`,
      request,
    });
  } catch (error) {
    console.error("UPDATE REQUEST STATUS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
