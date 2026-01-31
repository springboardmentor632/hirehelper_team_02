import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Notification from "./Notification";
import API from "../api";
import "../styles/myRequests.css";
import { formatDateTimeWithAgo } from "../utils/formatDateTime";

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
    interval = setInterval(fetchMyRequests, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="myrequests-layout">
      {/* 🔥 Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      {/* 🔥 Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔥 Main Content */}
      <main className="myrequests-content">
        {/* 🔥 Hamburger (mobile only) */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>

        <div className="myrequests-page">
          {/* Header */}
          <div className="myrequests-header">
            <div>
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
                    <div className="avatar">
                      {req.owner?.profileImage ? (
                        <img
                          src={req.owner.profileImage}
                          alt="owner"
                        />
                      ) : (
                        req.owner?.firstName?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>

                    <div className="card-content">
                      {/* <h3>{req.task?.title}</h3> */}

                      

                      <div className="message-box">
                        <h3 className="owner">
                        {req.owner?.firstName}{" "}
                        {req.owner?.lastName}
                      </h3>
                        {/* <label>Your Request:</label> */}
                        <p>You have requested for {req.task?.title || ""} task. <br />
                        <b>Category: </b> {req.task?.category || "N/A"} <br />
                        <strong>For location: </strong>{req.task.location} <br /></p>
                      </div>

                      <div className="meta-row">
                        <span>🕒 {formatDateTimeWithAgo(req.createdAt)}</span>

                        {req.taskId?.location && (
                          <>
                            <span className="dot">•</span>
                            <span>📍 {req.task.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`status ${req.status}`}>
                    {req.status.charAt(0).toUpperCase() +
                      req.status.slice(1)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyRequests;
