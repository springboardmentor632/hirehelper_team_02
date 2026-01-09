import { useEffect, useState } from "react";
import "../styles/Feed.css";
import Sidebar from "./Sidebar";
import TaskCard from "./TaskCard";
import Notification from "./Notification";
import API from "../api";

export default function Feed() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await API.get("/tasks/feed");
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="feed-layout">
      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="feed-content">
        {/* Hamburger */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Header */}
        <div className="feed-header">
          <div>
            <h2>Feed</h2>
            <p>Find tasks that need help</p>
          </div>
          <Notification />
        </div>

        {/* Task grid */}
        <div className="task-grid">
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
