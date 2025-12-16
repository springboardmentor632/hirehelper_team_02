const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"HireHelper" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `<div style="background:#f4f6f8;padding:30px;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:500px;margin:auto;background:#ffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="padding:16px;text-align:center;">
            <h1 style="color:#4a4df7;margin:0;padding-top: 10px;">HireHelper</h1>
            <Hr style="width: 70%;background-color: #000;"></Hr>
          </div>

          <!-- Body -->
          <div style="padding:24px;color:#333;padding-top: 6px;">
            <p style="font-size:14px;">Hello,</p>

            <p style="font-size:14px;">
              Your One-Time Password (OTP) is:
            </p>

            <div style="background:#f1f3f9;border-radius:6px;padding:14px;text-align:center;margin:20px 0;">
              <span style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#4a4df7;">
                ${otp}
              </span>
            </div>

            <p style="font-size:13px;color:#555;">
              This OTP is valid for <b>2 minutes</b>.  
              Please do not share this code with anyone.
            </p>

            <p style="font-size:13px;color:#777;margin-top:20px;">
              If you didn’t request this code, please ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f8fafc;padding:12px;text-align:center;font-size:12px;color:#999;">
            © 2025 HireHelper. All rights reserved.
          </div>
        </div>
      </div>
    `
  });
};