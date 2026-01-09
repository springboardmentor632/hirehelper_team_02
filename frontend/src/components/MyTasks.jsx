import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MyTaskCard from "./MyTaskCard";
import Notification from "./Notification";
import API from "../api";
import "../styles/myTasks.css";

const MyTasks = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const res = await API.get("/tasks/my");
        setMyTasks(res.data || []);
      } catch (err) {
        console.error("MY TASKS ERROR:", err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  return (
    <div className="mytasks-layout">
      {/* Sidebar overlay (mobile only) */}
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
      <main className="mytasks-content">
        {/* Hamburger (mobile only) */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Header */}
        <div className="mytasks-header">
          <div className="header-left">
            <h2>My Tasks</h2>
            <p>Manage your posted tasks</p>
          </div>
          <Notification />
        </div>

        {/* Error */}
        {error && <p className="error-text">{error}</p>}

        {/* Tasks */}
        <div className="mytasks-grid">
          {loading ? (
            <p>Loading tasks...</p>
          ) : myTasks.length === 0 ? (
            <p>No tasks created yet</p>
          ) : (
            myTasks.map((task) => (
              <MyTaskCard key={task._id} task={task} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTasks;
