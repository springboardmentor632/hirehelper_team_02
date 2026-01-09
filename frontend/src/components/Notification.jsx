import React, { useState, useRef, useEffect } from "react";
import "../styles/Notification.css";
import { FiBell } from "react-icons/fi";
import API from "../api";

/* ================= TIME FORMAT ================= */
const formatDateTime = (date) => {
  const d = new Date(date);
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const day = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  const diffDays = Math.floor(
    (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)
  );

  return `${diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""} ago • ` : ""}${day}, ${time}`;
};

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data || []);
      } catch (err) {
        console.error("NOTIFICATION FETCH ERROR:", err);
      }
    };
    fetchNotifications();
  }, []);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= UNREAD COUNT ================= */
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ================= MARK ONE ================= */
  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("MARK READ ERROR:", err);
    }
  };

  /* ================= MARK ALL ================= */
  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("MARK ALL READ ERROR:", err);
    }
  };

  return (
    <div className="notification-container" ref={notificationRef}>
      {/* 🔔 Bell */}
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="notification-dropdown modern">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <ul className="notification-list">
            {notifications.length === 0 ? (
              <li className="notification-empty">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n._id}
                  className={`notification-item modern ${n.isRead ? "read" : "unread"
                    }`}
                  onClick={() => markAsRead(n._id)}
                >
                  <div className="notif-avatar">
                    {n.sender?.profileImage ? (
                      <img src={n.sender.profileImage} alt="user" />
                    ) : (
                      (n.sender?.firstName || "U").charAt(0).toUpperCase()

                    )}
                  </div>


                  <div className="notif-content">
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-time">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>

                  {!n.isRead && <span className="notif-unread-dot" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
