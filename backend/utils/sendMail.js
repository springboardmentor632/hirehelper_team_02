import nodemailer from "nodemailer";

const sendMail = async (email, otp) => {
  try {
    // Create a fake Ethereal account
    const testAccount = await nodemailer.createTestAccount();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: "HireHelper 🔐 <no-reply@hirehelper.dev>",
      to: email,
      subject: "🔐 HireHelper | OTP Verification",
      text: `
Hello 👋,

Welcome to HireHelper

Your One-Time Password (OTP) is: ${otp}

🔑 This OTP is valid for 10 minutes.
⚠️ Please do not share this OTP with anyone.

If you did not request this verification, you can safely ignore this email.

Happy learning & job hunting! 💼✨
— Team HireHelper
      `,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>🔐 HireHelper OTP Verification</h2>

          <p>Hello,</p>

          <p>
            Welcome to <strong>HireHelper</strong> 🚀 <br/>
            We’re excited to have you onboard!
          </p>

          <p>
            👉 <strong>Your OTP:</strong>
            <span style="font-size: 20px; font-weight: bold; color: #2c7be5;">
              ${otp}
            </span>
          </p>

          <p>
            ⏰ This OTP is valid for <strong>30 Seconds</strong>.<br/>
            🔒 Please <strong>do not share</strong> this OTP with anyone.
          </p>

          <p>
            If you didn’t request this verification, you can safely ignore this email.
          </p>

          <hr />

          <p style="font-size: 14px; color: #555;">
            💼 Happy learning & job hunting! <br/>
            <strong>— Team HireHelper</strong>
          </p>
        </div>
      `,
    });

    // Browser preview link
    console.log("📩 Ethereal Email Preview URL:");
    console.log(nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Ethereal email failed:", error.message);
    throw error;
  }
};

export default sendMail;
