import { useState } from "react";
import "../styles/Feed.css";
import Sidebar from "./Sidebar";
import TaskCard from "./TaskCard";

export default function Feed() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="feed-layout">

      {/* 🔥 Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔥 Sidebar wrapper */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      {/* 🔥 Main content */}
      <main className="feed-content">

        {/* 🍔 Hamburger (mobile only) */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          ☰
        </button>

        <div className="feed-header">
          <h2>Feed</h2>
          <p>Find tasks that need help</p>
        </div>

        <div className="task-grid">
          <TaskCard
            image="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
            title="Help Moving Furniture"
            desc="Need help moving furniture from my apartment to a new house."
            user="Saurav Mehta"
          />

          <TaskCard
            image="https://images.unsplash.com/photo-1587202372775-e229f172b9d7"
            title="Help Computer Setup"
            desc="Need help to setup my computer system."
            user="Khushi Mehta"
          />

          <TaskCard
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            title="Plumbing Work"
            desc="Need help fixing kitchen sink leakage."
            user="Rahul"
          />
        </div>
      </main>
    </div>
  );
}
