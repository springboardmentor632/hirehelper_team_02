// import React from "react";
import React, { useEffect, useCallback, useState, useRef } from "react";
const MyTaskCard = ({ task }) => {
  return (
    <div className="mytasks-card">
      <div className="mytasks-image">
        <img src={task.image} alt={task.title} />
      </div>

      <div className="mytasks-tags">
        <span className="mytasks-tag category">{task.category}</span>
        <span className="mytasks-tag status">{task.status}</span>
      </div>

      <h4 className="mytasks-title">{task.title}</h4>

      <p className="mytasks-desc">{task.description}</p>

      <div className="mytasks-info">
        <span>📍 {task.location}</span>
        <span>⏱ {task.time}</span>
      </div>
    </div>
  );
};

export default MyTaskCard;
