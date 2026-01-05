import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Settings.css";
import Notification from "./Notification";

const DEFAULT_USER_ICON = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Settings = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(DEFAULT_USER_ICON);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef(null);

  // Upload new photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePhoto(imageURL);
    }
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setProfilePhoto(DEFAULT_USER_ICON);
  };

  // Save changes
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-page">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Image modal */}
      {showImage && (
        <div className="image-overlay" onClick={() => setShowImage(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <img src={profilePhoto} alt="Profile Large" />
            <button className="close-btn" onClick={() => setShowImage(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="settings-content">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

        <div className="settings-header">
          <div className="header-left">
            <h2>Settings</h2>
            <p>Manage your profile and account preferences</p>
          </div>
          <Notification />
        </div>

        {/* Profile Picture */}
        <div className="settings-card">
          <h3>Profile Picture</h3>
          <div className="profile-row">
            <img
              src={profilePhoto}
              alt="Profile"
              className="profile-img"
              onClick={() => setShowImage(true)}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handlePhotoChange}
            />
            <button className="primary-btn" onClick={() => fileInputRef.current.click()}>Change Photo</button>
            <button className="text-btn" onClick={handleRemovePhoto}>Remove</button>
          </div>
        </div>

        {/* Personal Info */}
        <div className="settings-card">
          <h3>Personal Information</h3>
          <div className="form-row name-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" defaultValue="John" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" defaultValue="Smith" />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue="johnsmith@example.com" />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" defaultValue="1234567890" />
          </div>

          <div className="form-group">
            <label>Bio (Optional)</label>
            <textarea defaultValue="Experienced handyman and problem solver. Available for various tasks including furniture assembly, basic electrical work, and home organization." />
          </div>

          <div className="save-btn-wrapper">
            <button className="primary-btn" onClick={handleSave}>Save Changes</button>

          </div>

          {saved && <p className="save-msg">✔ Changes saved successfully</p>}
        </div>

        {/* Account Security */}
        <div className="settings-card">
          <h3>Account Security</h3>
          <div className="security-row">
            <span>Password</span>
            <button className="text-btn" onClick={() => navigate("/change-password")} >Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
