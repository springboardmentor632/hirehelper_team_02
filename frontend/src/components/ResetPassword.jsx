import React, { useState, useEffect, useCallback } from "react";
import "../styles/forgot-password.css";
import API from "../api";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gridCells, setGridCells] = useState([]);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // 🔒 Safety redirect
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // ✅ SAME GRID BACKGROUND AS OTHER PAGES
  const generateGrid = useCallback(() => {
    const totalCells = 380;
    const highlights = [
      9, 19, 46, 90, 125, 156, 200, 210, 232, 256, 266, 289,
      302, 311, 15, 20, 121, 23, 49, 5, 70, 104, 137, 168,
      184, 223, 245, 351
    ];
    const shadows = [
      13, 42, 58, 81, 118, 143, 150, 181, 196, 219,
      228, 262, 294, 306, 325, 360, 373
    ];

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      let cls = "grid-cell";
      if (highlights.includes(i)) cls += " highlight";
      else if (shadows.includes(i)) cls += " shadow";
      cells.push(<div key={i} className={cls}></div>);
    }
    return cells;
  }, []);

  useEffect(() => {
    setGridCells(generateGrid());
  }, [generateGrid]);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);
      await API.post("/auth/reset-password", {
        email,
        password: newPassword
      });

      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginPage">
      {/* GRID BACKGROUND */}
      <div className="grid-background">{gridCells}</div>

      {/* CONTENT */}
      <div className="main-container">
        <div className="otp-wrapper">
          <div className="forgot-card">
            <h2 className="forgot-title">Reset Password</h2>

            <p className="enter-email-text">New Password</p>
            <div className="password-group reset-password-group">
              <input
                type={showNewPassword ? "text" : "password"}
                className="forgot-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="pw-toggle reset-eye"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i className={showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"} />
              </button>
            </div>


            <p className="enter-email-text">Re-enter New Password</p>
            <input
              type="password"
              className="forgot-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className="verify-btn"
              onClick={handleReset}
            >

              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
