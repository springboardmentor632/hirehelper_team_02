import { useEffect, useState } from "react";
import "../styles/Feed.css";
import TaskCard from "./TaskCard";
import API from "../api";

export default function Feed() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedTasks = async () => {
      try {
        const res = await API.get("/tasks/feed");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load feed");
      }
    };

    fetchFeedTasks();
  }, []);

  return (
    <main className="feed-content">
      <div className="feed-header">
        <h2>Feed</h2>
        <p>Find tasks that need help</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="task-grid">
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              image={task.image}
              title={task.title}
              desc={task.description}
              user={`${task.createdBy?.firstName || ""} ${
                task.createdBy?.lastName || ""
              }`}
            />
          ))
        )}
      </div>
    </main>
  );
}
