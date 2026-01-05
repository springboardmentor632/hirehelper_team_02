
import React, { useState, useRef, useEffect } from 'react';
import '../styles/Notification.css';
import { FiBell } from 'react-icons/fi';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  const notifications = [
    { id: 1, message: 'New task "Help Moving Furniture" has been posted.' },
    { id: 2, message: 'Your request for "Computer Setup" has been accepted.' },
    { id: 3, message: 'Reminder: "Plumbing Work" is scheduled for tomorrow.' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="notification-container" ref={notificationRef}>
      <button className="notification-button" onClick={() => setIsOpen(!isOpen)}>
        <FiBell />
        {notifications.length > 0 && <span className="notification-dot"></span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
          </div>
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification.id} className="notification-item">
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
