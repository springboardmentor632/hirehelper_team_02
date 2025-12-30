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
  return (
    <div className="mytasks-card">
      <div className="mytasks-image">
        <img src={task.image} alt={task.title} />
      </div>

      <div className="mytasks-tags">
        <span className="mytasks-tag category">
          {task.category?.trim() || "General"}
        </span>

        <span className="mytasks-tag status">{task.status}</span>
      </div>

      <h4 className="mytasks-title">{task.title}</h4>

      <p className="mytasks-desc">{task.description}</p>

      <div className="mytasks-info">
        <span>📍 {task.location}</span>

        {task.startTime && task.endTime && (
          <span>
            ⏰ {formatTime(task.startTime)} - {formatTime(task.endTime)}
          </span>
        )}
      </div>
    </div>
  );
};

export default MyTaskCard;
