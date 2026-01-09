import Notification from "../models/Notification.js";

/* =========================
   GET NOTIFICATIONS
========================= */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id
    })
      .populate("sender", "firstName lastName profileImage")
      .sort({ createdAt: -1 });


    res.status(200).json(notifications);
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   MARK SINGLE NOTIFICATION AS READ
========================= */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("MARK AS READ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   MARK ALL NOTIFICATIONS AS READ
========================= */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("MARK ALL AS READ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
