import React from "react";

const MyTaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <div className="task-image">
        <img src={task.image} alt={task.title} />
      </div>

      <div className="task-tags">
        <span className="tag category">{task.category}</span>
        <span className="tag status">{task.status}</span>
      </div>

      <h4 className="task-title">{task.title}</h4>

      <p className="task-desc">{task.description}</p>

      <div className="task-info">
        <span>📍 {task.location}</span>
        <span>⏱ {task.time}</span>
      </div>
    </div>
  );
};

export default MyTaskCard;