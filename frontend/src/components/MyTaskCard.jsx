import React from "react";

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MyTaskCard = ({ task }) => {
  // 🔒 Safety guard (prevents empty / ghost cards)
  if (!task) return null;

  return (
    <div className="mytasks-card">
      {/* Task Image */}
      <div className="mytasks-image">
        <img
          src={
            task.image
              ? task.image
              : "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={task.title || "Task image"}
        />
      </div>

      {/* Tags */}
      <div className="mytasks-tags">
        <span className="mytasks-tag category">
          {task.category ? task.category : "General"}
        </span>

        <span className="mytasks-tag status">
          {task.status ? task.status : "Open"}
        </span>
      </div>

      {/* Title */}
      <h4 className="mytasks-title">{task.title}</h4>

      {/* Description */}
      <p className="mytasks-desc">{task.description}</p>

      {/* Info */}
      <div className="mytasks-info">
        <span>📍 {task.location}</span>

        {task.startTime && (
          <span>
            ⏰ {formatTime(task.startTime)}
            {task.endTime && ` - ${formatTime(task.endTime)}`}
          </span>
        )}
      </div>
    </div>
  );
};

export default MyTaskCard;
