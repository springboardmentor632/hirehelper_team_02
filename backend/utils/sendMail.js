import nodemailer from "nodemailer";

const sendMail = async (email, otp) => {
  // 🔥 ALWAYS log OTP for dev / submission safety
  console.log("======================================");
  console.log("📧 OTP REQUEST");
  console.log("👤 Email:", email);
  console.log("🔐 OTP :", otp);
  console.log("======================================");

  // Try sending email, but NEVER break auth flow if it fails
  try {
    // If Gmail credentials are missing, skip email silently
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ EMAIL SKIPPED: Gmail credentials missing");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"HireHelper 🔐" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 HireHelper | OTP Verification",
      html: `
        <h2>HireHelper OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    console.log("✅ Email sent successfully (Gmail)");
    console.log("📨 Message ID:", info.messageId);
  } catch (error) {
    // ❌ DO NOT throw — allow signup / reset to continue
    console.warn("⚠️ Email failed, using terminal OTP only");
  }
};

export default sendMail;
