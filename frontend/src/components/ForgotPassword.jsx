import React, { useEffect, useCallback, useState, useRef } from "react";
import "../styles/login.css";              // grid background
import "../styles/forgot-password.css";    // forgot page styles
import logoImage from "../assets/logo.png";
import API from "../api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [gridCells, setGridCells] = useState([]);
  const [showOtp, setShowOtp] = useState(false);
  const otpRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();


  // GRID BACKGROUND
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

  // OTP helpers
  const handleOtpChange = (e, index) => {
    if (e.target.value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpRefs.current[index - 1].focus();
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

          {/* CARD */}
          <div className="forgot-card">
            <h2 className="forgot-title">Forgot Password</h2>
            <p className="forgot-subtitle">
              Enter your email used to authenticate
            </p>

            {/* EMAIL */}
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
                onClick={async () => {
                  if (!email) return alert("Enter email");

                  try {
                    setLoading(true);
                    await API.post("/auth/send-otp", { email });
                    alert("OTP sent to your email");
                    setShowOtp(true);
                  } catch (err) {
                    alert(err.response?.data?.message || "Failed to send OTP");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>

            {/* OTP SECTION */}
            {showOtp && (
              <>
                <p className="enter-otp-text">Enter OTP</p>

                <div className="otp-boxes">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      maxLength="1"
                      value={value}
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[index] = e.target.value;
                        setOtp(newOtp);
                        handleOtpChange(e, index);
                      }}
                      onKeyDown={(e) => handleOtpBackspace(e, index)}
                    />
                  ))}
                </div>

                <p className="otp-info">Sent to your mail id</p>

                <button
                  className="verify-btn"
                  onClick={async () => {
                    const enteredOtp = otp.join("");

                    if (enteredOtp.length !== 6) {
                      return alert("Enter complete OTP");
                    }

                    try {
                      await API.post("/auth/verify-otp", {
                        email,
                        otp: enteredOtp
                      });
                      navigate("/reset-password", {
                        state: { email }
                      });

                    } catch (err) {
                      alert(err.response?.data?.message || "Invalid OTP");
                    }
                  }}
                >
                  Verify Code
                </button>

                <p className="resend-text">
                  Haven’t got the OTP yet?{" "}
                  <span
                    onClick={async () => {
                      try {
                        await API.post("/auth/send-otp", { email });
                        alert("OTP resent successfully");
                      } catch (err) {
                        alert(err.response?.data?.message || "Failed to resend OTP");
                      }
                    }}
                  >
                    Resend
                  </span>
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
