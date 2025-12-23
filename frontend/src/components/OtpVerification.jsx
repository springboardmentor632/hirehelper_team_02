import React, { useState, useEffect, useCallback, useRef } from "react";
import "../styles/otp.css";
import logoImage from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [gridCells, setGridCells] = useState([]);
  const navigate = useNavigate();

  const generateGrid = useCallback(() => {
    const totalCells = 380;
    const highlights = [9,19,46,90,125,156,200,210,232,256,266,289,302,311,15,20,121,23,49,5,70,104,137,168,184,223,245,351];
    const shadows = [13,42,58,81,118,143,150,181,196,219,228,262,294,306,325,360,373];

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      let className = "grid-cell";
      if (highlights.includes(i)) className += " highlight";
      else if (shadows.includes(i)) className += " shadow";
      cells.push(<div key={i} className={className}></div>);
    }
    return cells;
  }, []);

  useEffect(() => {
    setGridCells(generateGrid());
  }, [generateGrid]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    if (otp.join("").length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }
    navigate("/feed");
  };

  return (
    <div className="otp-page">
      <div className="grid-background">{gridCells}</div>

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

          {/* OTP CARD */}
          <div className="otp-card">
            <h2 className="card-title">Secure Email Verification</h2>
            <p className="card-desc">
              We’ve sent a 6-digit OTP to your registered email.
              Please verify to continue securely.
            </p>

            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
            </div>

            <button onClick={handleVerify}>Verify Code</button>
            <div className="resend">
              Didn’t receive the code? <span>Resend</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OtpVerification;