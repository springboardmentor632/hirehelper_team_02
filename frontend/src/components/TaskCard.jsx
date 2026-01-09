import { useState } from "react";
import API from "../api";

export default function TaskCard({ task }) {
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!task) return null;

  const handleRequest = async () => {
    try {
      setLoading(true);
      await API.post("/requests", {
        taskId: task._id,
      });
      setRequested(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-card">
      <img
        src={task.image || "https://via.placeholder.com/300"}
        alt={task.title}
      />

      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div className="meta">📍 {task.location}</div>

      <div className="footer">
        <span>{task.createdBy?.firstName || "User"}</span>

        <button
          disabled={requested || loading}
          onClick={handleRequest}
          className={requested ? "disabled-btn" : ""}
        >
          {requested ? "Request Sent" : "Request Help"}
        </button>
      </div>
    </div>
  );
}
