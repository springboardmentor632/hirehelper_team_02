import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Always load full user including profileImage
    const user = await User.findById(decoded.id).select(
      "firstName lastName email phoneNumber profileImage"
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 Attach normalized user object
    req.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
