import { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/request.css";

export default function Request() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="request-layout">
      {/*  Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/*  Sidebar wrapper */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <main className="request-content">
        {/*  Hamburger (mobile only) */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>
        <div className="request-page">
          {/* Header */}
          <div className="request-header">
            <h1>Requests</h1>
            <p>People who want to help with your tasks</p>
          </div>

          {/* Incoming Requests */}
          <div className="incoming-section">
            <h2>Incoming Requests</h2>
            <p className="sub-text">People who want to help with your tasks</p>

            {/* Request Card */}
            <div className="request-card">
              <div className="request-left">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="profile"
                  className="profile-img"
                />

                <div className="request-info">
                  <h3>
                    Sarah Johnson <span className="rating">4★</span>{" "}
                    <span className="reviews">(18 Reviews)</span>
                  </h3>

                  <p className="description">
                    Hi I'd love to help to your computer setup. I have 5+ years
                    of experience and can handle networking, software
                    installation, and troubleshooting. Available tomorrow
                    afternoon as required.
                  </p>

                  <div className="request-for">
                    <span>Request For:</span>
                    <div className="task-chip">Computer Setup</div>
                  </div>

                  <div className="time">🕒 38 minutes ago</div>
                </div>
              </div>

              <div className="request-actions">
                <button className="accept-btn">Accept</button>
                <button className="decline-btn">Decline</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
