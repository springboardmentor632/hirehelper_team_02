import { useState } from "react";
import API from "../api";
import defaultTaskImage from "../assets/logo.png"; // HireHelper default image

export default function TaskCard({ task }) {
  const [requested, setRequested] = useState(task?.isRequested || false);
  const [loading, setLoading] = useState(false);

  if (!task) return null;

  const owner = task.createdBy || {};
  const ownerName = owner.firstName || "Owner";
  const profileImage = owner.profileImage;

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  // ✅ Image fallback logic (IMPORTANT)
  const hasImage = task.image && task.image.trim() !== "";
  const imageSrc = hasImage ? task.image : defaultTaskImage;

  const handleRequest = async () => {
    try {
      setLoading(true);
      await API.post("/requests", { taskId: task._id });
      setRequested(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-card">
      {/* 🖼 Image */}
      <div className="task-image-wrapper">
        <img
          src={imageSrc}
          alt={task.title || "Task image"}
          className={`task-image ${!hasImage ? "default-image" : ""}`}
        />
      </div>

      {/* 🧾 Body */}
      <div className="task-body">
        {/* Top row */}
        <div className="task-top">
          <span className="task-category">
            {task.category || "General"}
          </span>
          <span className="task-date">{formattedDate}</span>
        </div>

        <h3 className="task-title">{task.title}</h3>
        <p className="task-desc">{task.description}</p>

        {task.location && (
          <div className="task-meta">📍 {task.location}</div>
        )}

        {/* Bottom row */}
        <div className="task-footer">
          <div className="task-owner">
            {profileImage ? (
              <img
                src={profileImage}
                alt={ownerName}
                className="owner-avatar"
              />
            ) : (
              <div className="owner-letter">
                {ownerName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="owner-name">{ownerName}</span>
          </div>

          <button
            disabled={requested || loading}
            onClick={handleRequest}
            className={`request-btn ${requested ? "sent" : ""}`}
          >
            {requested ? "Request Sent" : "Request Help"}
          </button>
        </div>
      </div>
    </div>
  );
}
