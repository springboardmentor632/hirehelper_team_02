import React, { useEffect, useCallback, useState, useRef } from "react";
import "../styles/login.css";
import "../styles/forgot-password.css";
import logoImage from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [gridCells, setGridCells] = useState([]);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  // 🔹 STATES
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [sending, setSending] = useState(false);
  const [otp, setOtp] = useState("");

  /* ================= GRID BACKGROUND ================= */
  const generateGrid = useCallback(() => {
    const totalCells = 380;
    const highlights = [
      9, 19, 46, 90, 125, 156, 200, 210, 232, 256, 266, 289,
      302, 311, 15, 20, 121, 23, 49, 5, 70, 104, 137, 168,
      184, 223, 245, 351,
    ];
    const shadows = [
      13, 42, 58, 81, 118, 143, 150, 181, 196, 219,
      228, 262, 294, 306, 325, 360, 373,
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

  /* ================= OTP INPUT HANDLERS ================= */
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!value) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    if (index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setSending(true);

      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setOtp("");
      setShowOtp(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  /* ================= VERIFY OTP (PASS TO RESET PAGE) ================= */
 const handleVerifyCode = async () => {
  if (otp.length !== 6) {
    alert("Please enter a valid 6-digit OTP");
    return;
  }

  try {
    // 🔐 VERIFY OTP WITH BACKEND
    await axios.post(
      "http://localhost:5000/api/auth/verify-reset-otp",
      { email, otp }
    );

    // ✅ OTP VERIFIED → NOW RESET PASSWORD
    navigate("/reset-password", {
      state: { email }
    });

  } catch (error) {
    alert(error.response?.data?.message || "Invalid OTP");
  }
};


  return (
    <div className="LoginPage">
      {/* GRID BACKGROUND */}
      <div className="grid-background">{gridCells}</div>

      {/* CONTENT */}
      <div className="main-container">
        <div className="otp-wrapper">

          {/* HEADER */}
          <div className="otp-header">
            <div className="logo-icon">
              <img src={logoImage} alt="HireHelper Logo" />
            </div>
            <h1>
              Welcome to <span>HireHelper</span>
            </h1>
          </div>

          {/* FORGOT PASSWORD CARD */}
          <div className="forgot-card">
            <h2 className="forgot-title">Forgot Password</h2>
            <p className="forgot-subtitle">
              Enter your email used to authenticate
            </p>

            {/* EMAIL INPUT */}
            <p className="enter-email-text">Enter Email</p>
            <div className="email-send-row">
              <input
                type="email"
                placeholder="Enter email"
                className="forgot-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="forgot-send-btn"
                onClick={handleSendOtp}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>

            {/* OTP SECTION */}
            {showOtp && (
              <>
                <p className="enter-otp-text">Enter OTP</p>

                <div className="otp-boxes">
                  {[0, 1, 2, 3, 4, 5].map((_, index) => (
                    <input
                      key={index}
                      maxLength="1"
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpBackspace(e, index)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <p className="otp-info">OTP sent successfully</p>

                <button
                  className="verify-btn"
                  onClick={handleVerifyCode}
                >
                  Verify Code
                </button>

                <p className="resend-text">
                  Haven’t got the OTP yet?{" "}
                  <span onClick={handleSendOtp}>Resend</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
