import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Notification from "./Notification";
import API from "../api";
import "../styles/request.css";
import { formatDateTimeWithAgo } from "../utils/formatDateTime";

export default function Request() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/requests/incoming");
        setRequests(res.data || []);
      } catch (err) {
        console.error("FETCH REQUESTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  /* ================= ACCEPT / DECLINE ================= */
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/requests/${id}`, { status });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div className="request-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <main className="request-content">
        <button className="menu-btn" onClick={() => setSidebarOpen((p) => !p)}>
          ☰
        </button>

        <div className="request-page">
          {/* HEADER */}
          <div className="request-header">
            <div>
              <h1>Requests</h1>
              <p>People who want to help with your tasks</p>
            </div>
            <Notification />
          </div>

          {/* INCOMING */}
          <div className="incoming-section">
            <h2>Incoming Requests</h2>
            <p className="sub-text">People who want to help with your tasks</p>

            {loading ? (
              <p>Loading requests...</p>
            ) : requests.length === 0 ? (
              <p>No incoming requests</p>
            ) : (
              requests.map((req) => {
                const requester = req.requester;   // ✅ correct field
                const task = req.task;             // ✅ correct field

                return (
                  <div className="incoming-card" key={req._id}>
                    {/* LEFT */}
                    <div className="incoming-left">
                      <div className="incoming-avatar">
                        {requester?.profileImage ? (
                          <img src={requester.profileImage} alt="user" />
                        ) : (
                          requester?.firstName?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>


                      <div className="incoming-content">
                        {/* NAME */}
                        <div className="incoming-name">
                          {requester
                            ? `${requester.firstName} ${requester.lastName}`
                            : "Unknown User"}
                        </div>
                        <hr />
                        {/* RATING */}
                        {/* <div className="incoming-rating">
                          ⭐ 4.8 <span>(18 reviews)</span>
                        </div> */}

                        {/* MESSAGE */}
                        <p className="incoming-message">
                          {req.message || "Wants to help with your task."}
                        </p>

                        {/* TASK */}
                        <div className="incoming-task">
                          <strong>Requesting for:</strong>{" "}
                          <span className="task-name">
                            {task?.title || "Unknown task"}
                          </span>
                        </div>

                        {/* META */}
                        <div className="incoming-meta">
                          <span>🕒 {formatDateTimeWithAgo(req.createdAt)}</span>
                          {task?.location && <span>📍 {task.location}</span>}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="incoming-actions">
                      <button
                        className="accept-btn"
                        onClick={() => updateStatus(req._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="decline-btn"
                        onClick={() => {
                          const confirmReject = window.confirm(
                            "Are you sure you want to decline this request?"
                          );

                          if (confirmReject) {
                            updateStatus(req._id, "rejected");
                          }
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
