const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTER USER
 * POST /api/users/register
 */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const emailLower = email.toLowerCase();

    
    const exists = await User.findOne({ email_id: emailLower });
    if (exists) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,

      
      email: emailLower,       
      email_id: emailLower,    

      phone,
      password: hashedPassword,
      role
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * LOGIN USER
 * POST /api/users/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const emailLower = email.toLowerCase();

    
    const user = await User.findOne({ email_id: emailLower }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

   
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
