import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Dashboard loaded successfully",
    data: {
      sections: [
        "Feed",
        "My Tasks",
        "Requests",
        "My Requests",
        "Add Task",
        "Settings"
      ]
    }
  });
});

export default router;