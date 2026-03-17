const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {

    const { fullName, email, password, phone, dob } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password required"
      });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      dob
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: user.dob
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// ================= LOGIN USER =================
const loginUser = async (req, res) => {

  try {

    const { email, password, fcmToken } = req.body;

    if (!email || !password || !fcmToken) {
      return res.status(400).json({
        message: "Email , password and fcmToken are  required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // 🔔 Save FCM token on login
    if (fcmToken) {
      user.fcmToken = fcmToken;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: user.dob
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ================= GET PROFILE =================
const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Profile fetched",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {

  try {

    const { fullName, phone, dob } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (dob) user.dob = dob;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ================= GET ALL USERS =================
const getAllUsers = async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.json({
      message: "All users fetched successfully",
      count: users.length,
      users
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers
};