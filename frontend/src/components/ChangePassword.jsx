import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Settings.css"; // reuse your existing Settings styles

const ChangePassword = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    if (!current || !newPass || !confirm) {
        alert("Please fill in all fields!");
        return;
    }

    if (newPass !== confirm) {
      alert("New password and confirm password should match!");
      return;
    }

    // API call to save password can be added here
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      navigate("/settings"); // redirect to settings after success
    }, 2000);
  };

  return (
    <div className="settings-page">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="settings-content">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

        <div className="settings-header">
          <h2>Change Password</h2>
          <p>Keep your account secure by creating a strong, unique password </p>
        </div>


        {/* Change Password Card */}
        <div className="settings-card" style={{ maxWidth: "600px", margin: "20px auto" }}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <div className="save-btn-wrapper">
            <button className="primary-btn" onClick={handleSave}>
              Save Password
            </button>
          </div>

          {success && <p className="save-msg">✔ Password changed successfully!</p>}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;