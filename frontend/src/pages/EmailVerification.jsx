import { useState, useRef } from "react";

export default function EmailVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <>
      {/* GRID BACKGROUND */}
      <div className="grid-background">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className={`grid-cell ${
              i % 17 === 0 ? "highlight" : i % 29 === 0 ? "shadow" : ""
            }`}
          />
        ))}
      </div>

      {/* PAGE WRAPPER (CENTERS CONTENT) */}
      <div className="otp-page">
        <div className="otp-wrapper">
          <h1 className="otp-title">Verify Your Email</h1>

          <p className="otp-subtitle">
            Enter 6 digit code sent to your email
          </p>

          <label className="otp-label">Verification Code</label>

          {/* OTP INPUTS */}
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                placeholder="0"
                inputMode="numeric"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-box"
              />
            ))}
          </div>

          <button className="otp-button">Verify Code</button>

          <p className="otp-resend">
            Don’t receive the code? <span>Resend</span>
          </p>
        </div>
      </div>
    </>
  );
}
