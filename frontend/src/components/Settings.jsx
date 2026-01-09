import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Settings.css";
import Notification from "./Notification";
import API from "../api";

const DEFAULT_USER_ICON =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Settings = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef(null);

  /* =========================
     LOAD USER
  ========================= */
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [profilePhoto, setProfilePhoto] = useState(
    user.profileImage || DEFAULT_USER_ICON
  );
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phoneNumber || "");
  const [selectedFile, setSelectedFile] = useState(null);

  /* =========================
     KEEP IN SYNC WITH STORAGE
  ========================= */
  useEffect(() => {
    const refreshUser = () => {
      const u = JSON.parse(localStorage.getItem("user")) || {};
      setUser(u);
      setProfilePhoto(u.profileImage || DEFAULT_USER_ICON);
    };

    window.addEventListener("profileUpdated", refreshUser);
    return () =>
      window.removeEventListener("profileUpdated", refreshUser);
  }, []);

  /* =========================
     IMAGE PREVIEW
  ========================= */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePhoto(URL.createObjectURL(file)); // preview only
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setProfilePhoto(DEFAULT_USER_ICON);
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phoneNumber", phone);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const res = await API.put("/auth/update-profile", formData);

      const updatedUser = res.data.user;

      // 🔥 Persist everywhere
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("profileUpdated"));

      // 🔥 Replace blob URL with real Cloudinary URL
      setProfilePhoto(updatedUser.profileImage || DEFAULT_USER_ICON);
      setSelectedFile(null);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error(error);
      alert("Profile update failed");
    }
  };

  return (
    <div className="settings-page">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Image modal */}
      {showImage && (
        <div className="image-overlay" onClick={() => setShowImage(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <img src={profilePhoto} alt="Profile Large" />
            <button className="close-btn" onClick={() => setShowImage(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <div className="settings-content">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>

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
            <button
              className="primary-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Change Photo
            </button>
            <button className="text-btn" onClick={handleRemovePhoto}>
              Remove
            </button>
          </div>
        </div>

        {/* Personal Info */}
        <div className="settings-card">
          <h3>Personal Information</h3>

          <div className="form-row name-row">
            <div className="form-group">
              <label>First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="save-btn-wrapper">
            <button className="primary-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>

          {saved && <p className="save-msg">✔ Changes saved successfully</p>}
        </div>

        <div className="settings-card">
          <h3>Account Security</h3>
          <div className="security-row">
            <span>Password</span>
            <button className="text-btn" onClick={() => navigate("/change-password")}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
