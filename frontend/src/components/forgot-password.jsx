import React, {
  useEffect,
  useCallback,
  useState,
  useRef
} from "react";
import "../styles/login.css"; // reuse background + grid
import "../styles/forgot-password.css"; // forgot password styles
import logoImage from "../assets/logo.png"; // SAME as OTP page

const ForgotPassword = () => {
  const [gridCells, setGridCells] = useState([]);
  const otpRefs = useRef([]);

  // SAME grid logic (unchanged)
  const generateGrid = useCallback(() => {
    const totalCells = 380;
    const highlights = [
      9,19,46,90,125,156,200,210,232,256,266,289,
      302,311,15,20,121,23,49,5,70,104,137,168,
      184,223,245,351
    ];
    const shadows = [
      13,42,58,81,118,143,150,181,196,219,
      228,262,294,306,325,360,373
    ];

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

  // OTP auto-focus logic
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
      <div className="grid-background">
        {gridCells}
      </div>

      {/* CONTENT */}
      <div className="main-container">
        <div className="otp-wrapper">

          {/* ✅ SAME HEADER AS OTP PAGE */}
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

            {/* EMAIL + SEND */}
            <p className="enter-email-text">Enter Email</p>
            <div className="email-send-row">
              <input
                type="email"
                placeholder="Enter email"
                className="forgot-input"
              />
              <button className="forgot-send-btn">Send</button>
            </div>

            {/* ENTER OTP */}
            <p className="enter-otp-text">Enter OTP</p>

            {/* OTP BOXES (6) */}
            <div className="otp-boxes">
              {[0,1,2,3,4,5].map((_, index) => (
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

            <p className="otp-info">Sent to your mail id</p>

            <button className="verify-btn">Verify Code</button>

            <p className="resend-text">
              Haven't got the OTP yet? <span>Resend</span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
