import User from "../models/user.js";
import sendMail from "../utils/sendMail.js";

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "Email already verified" });

    // COOLDOWN CHECK (30 seconds)
    if (user.otpLastSentAt) {
      const diffSeconds =
        (Date.now() - user.otpLastSentAt.getTime()) / 1000;

      if (diffSeconds < 30) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(
            30 - diffSeconds
          )} seconds before resending OTP`,
        });
      }
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    user.otpLastSentAt = new Date(); // 👈 update cooldown time
    await user.save();

    await sendMail(emailLower, otp);

    res.json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
