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

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?._id;

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

  const handleDelete = (taskId) => {
    setMyTasks((prev) => prev.filter((task) => task._id !== taskId));
  };

  return (
    <div className="mytasks-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <main className="mytasks-content">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>

        <div className="mytasks-header">
          <div className="header-left">
            <h2>My Tasks</h2>
            <p>Manage your posted tasks</p>
          </div>
          <Notification />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="mytasks-grid">
          {loading ? (
            <p>Loading tasks...</p>
          ) : myTasks.length === 0 ? (
            <p>No tasks created yet</p>
          ) : (
            myTasks.map((task) => (
              <MyTaskCard
                key={task._id}
                task={task}
                currentUserId={currentUserId}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTasks;
