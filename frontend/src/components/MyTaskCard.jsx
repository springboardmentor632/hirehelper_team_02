import React, { useState } from "react";
import API from "../api";
import defaultTaskImage from "../assets/logo.png";
import "../styles/myTasks.css";

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MyTaskCard = ({ task, onDelete }) => {
  if (!task) return null;

  const [deleting, setDeleting] = useState(false);

  const hasImage = task.image && task.image.trim() !== "";
  const imageSrc = hasImage ? task.image : defaultTaskImage;

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;

    try {
      setDeleting(true);
      await API.delete(`/tasks/${task._id}`);
      onDelete?.(task._id);
    } catch (err) {
      alert(err.response?.data?.message || "Not authorized to delete this task");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mytasks-card">
      {/* Image */}
      <div className="mytasks-image">
        <img
          src={imageSrc}
          alt={task.title || "Task image"}
          className={`mytasks-img ${!hasImage ? "default-image" : ""}`}
        />
      </div>

      {/* Tags */}
      <div className="mytasks-tags">
        <span className="mytasks-tag category">
          {task.category || "General"}
        </span>
        <span className="mytasks-tag status">
          {task.status || "Open"}
        </span>
      </div>

      <h4 className="mytasks-title">{task.title}</h4>
      <p className="mytasks-desc">{task.description}</p>

      <div className="mytasks-info">
        {task.location && <span>📍 {task.location}</span>}
        {task.startTime && (
          <span>
            ⏰ {formatTime(task.startTime)}
            {task.endTime && ` - ${formatTime(task.endTime)}`}
          </span>
        )}
      </div>

      {/* ✅ ALWAYS RENDER – hover controlled by CSS */}
      <button
        className="mytasks-delete-btn"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default MyTaskCard;
