import nodemailer from "nodemailer";

const sendMail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`
    });

    console.log("OTP email sent");
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

export default sendMail;
