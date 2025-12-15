import nodemailer from "nodemailer";

const sendMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "HireHelper OTP Verification",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });
};

export default sendMail;
