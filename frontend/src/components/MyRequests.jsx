import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Notification from "./Notification";
import API from "../api";
import "../styles/myRequests.css";
import { formatDateTimeWithAgo } from "../utils/formatDateTime";


const formatTimeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const MyRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let interval;

  const fetchMyRequests = async () => {
    try {
      const res = await API.get("/requests/my");
      setRequests(res.data || []);
    } catch (error) {
      console.error("FETCH MY REQUESTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchMyRequests();

  // 🔄 auto refresh every 10 seconds
  interval = setInterval(fetchMyRequests, 10000);

  return () => clearInterval(interval);
}, []);


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

        {/* Container */}
        <div className="myrequests-container">
          <div className="myrequests-page">
            {/* Header */}
            <div className="myrequests-header">
              <div className="header-left">
                <h1>My Requests</h1>
                <p>Track the help request you have sent</p>
              </div>
              <Notification />
            </div>

            {/* Section */}
            <div className="myrequests-section">
              <h2>Outgoing Requests</h2>
              <p>Need someone for help</p>

              {loading ? (
                <p>Loading requests...</p>
              ) : requests.length === 0 ? (
                <p>No requests sent yet</p>
              ) : (
                requests.map((req) => (
                  <div className="myrequest-card" key={req._id}>
                    <div className="card-left">
                      <div className="avatar">👤</div>

                      <div className="card-content">
                        <h3>{req.taskId?.title}</h3>

                        <p className="owner">
                          Task owner:{" "}
                          {req.owner?.firstName} {req.owner?.lastName}
                        </p>

                        <div className="message-box">
                          <label>Your Message:</label>
                          <p>{req.message || "No message provided"}</p>
                        </div>

                        <div className="time-row">
                          <div className="meta-row">
                          <span>🕒 {formatDateTimeWithAgo(req.createdAt)}</span>

                            {req.taskId?.location && (
                              <>
                                <span className="dot">•</span>
                                <span>📍 {req.taskId.location}</span>
                              </>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`status ${req.status}`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
