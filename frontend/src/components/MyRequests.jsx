import React, { useEffect, useCallback, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/myRequests.css";
import Notification from "./Notification";

const MyRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Mobile Header */}
        <div className="mobile-header">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* ADDED WRAPPER (THIS IS THE FIX) */}
        <div className="myrequests-container">
          {/* Glass Background */}
          <div className="myrequests-page">
            <div className="myrequests-header">
              <div className="header-left">
                <h1>My Requests</h1>
                <p>Track the help request you have sent</p>
              </div>
              <Notification />
            </div>

            <div className="myrequests-section">
              <h2>Outgoing Requests</h2>
              <p>Need someone for help</p>

              <div className="myrequest-card">
              <div className="card-left">
                <div className="avatar">👤</div>

                <div className="card-content">
                  <h3>Help for Computer Setup</h3>
                  <p className="owner">Task owner: Scott McDaniel</p>

                  <div className="message-box">
                    <label>Your Message:</label>
                    <p>
                      I want help to setup my computer system for the location WA.
                    </p>
                  </div>

                  <div className="time-row">
                    <span className="msg-icon">💬</span>
                    <span>1 day ago</span>
                  </div>
                </div>
              </div>
              
              <div className="status">Pending</div>
            </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
