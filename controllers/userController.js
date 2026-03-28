// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const admin = require("../config/firebase");

// // ================= REGISTER USER =================
// const registerUser = async (req, res) => {
//   try {

//     const { fullName, email, password, phone, dob } = req.body;

//     if (!fullName || !email || !password) {
//       return res.status(400).json({
//         message: "Full name, email and password required"
//       });
//     }

//     const exist = await User.findOne({ email });

//     if (exist) {
//       return res.status(400).json({
//         message: "Email already registered"
//       });
//     }

//     const user = await User.create({
//       fullName,
//       email,
//       password,
//       phone,
//       dob
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         dob: user.dob
//       }
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });

//   }
// };



// // ================= LOGIN USER =================
// const loginUser = async (req, res) => {

//   try {

//     const { email, password, fcmToken } = req.body;

//     if (!email || !password || !fcmToken) {
//       return res.status(400).json({
//         message: "Email , password and fcmToken are  required"
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid email or password"
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Invalid email or password"
//       });
//     }

//     // 🔔 Save FCM token on login
//     if (fcmToken) {
//       user.fcmToken = fcmToken;
//       await user.save();
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         dob: user.dob
//       }
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });

//   }

// };



// // ================= GET PROFILE =================
// const getProfile = async (req, res) => {

//   try {

//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     res.json({
//       message: "Profile fetched",
//       user
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });

//   }

// };



// // ================= UPDATE PROFILE =================
// const updateProfile = async (req, res) => {

//   try {

//     const { fullName, phone, dob } = req.body;

//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     if (fullName) user.fullName = fullName;
//     if (phone) user.phone = phone;
//     if (dob) user.dob = dob;

//     await user.save();

//     res.json({
//       message: "Profile updated successfully",
//       user
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });

//   }

// };



// // ================= GET ALL USERS =================
// const getAllUsers = async (req, res) => {

//   try {

//     const users = await User.find().select("-password");

//     res.json({
//       message: "All users fetched successfully",
//       count: users.length,
//       users
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });

//   }

// };

// // ================= GOOGLE LOGIN =================
// const googleLogin = async (req, res) => {
//   try {
//     const { idToken, fcmToken, phone, dob } = req.body;

//     // ✅ 1. Token check
//     if (!idToken) {
//       return res.status(400).json({
//         message: "Google token required"
//       });
//     }

//     // ✅ 2. Firebase verify
//     const decoded = await admin.auth().verifyIdToken(idToken);

//     const { uid, email, name, picture } = decoded;

//     // ✅ 3. Email must
//     if (!email) {
//       return res.status(400).json({
//         message: "Google account has no email"
//       });
//     }

//     // ✅ 4. Check existing user
//     let user = await User.findOne({ email });

//     if (!user) {
//       // 🆕 NEW USER
//       user = await User.create({
//         fullName: name || "Google User",
//         email,
//         googleId: uid,
//         profilePic: picture || "",
//         phone: phone || "",
//         dob: dob ? new Date(dob) : null,
//         fcmToken
//       });
//     } else {
//       // 🔄 EXISTING USER UPDATE

//       // Google ID add only if not exists
//       if (!user.googleId) {
//         user.googleId = uid;
//       }

//       // Profile pic only if empty
//       if (!user.profilePic && picture) {
//         user.profilePic = picture;
//       }

//       // Optional updates
//       if (phone) user.phone = phone;
//       if (dob) user.dob = new Date(dob);
//       if (fcmToken) user.fcmToken = fcmToken;

//       await user.save();
//     }

//     // ✅ 5. JWT generate
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // ✅ 6. Response
//     res.json({
//       message: "Google login successful",
//       token,
//       isProfileComplete: !!(user.phone && user.dob), // 🔥 IMPORTANT
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phone: user.phone,
//         dob: user.dob,
//         profilePic: user.profilePic
//       }
//     });

//   } catch (error) {
//     res.status(401).json({
//       message: "Google auth failed",
//       error: error.message
//     });
//   }
// };
// module.exports = {
//   registerUser,
//   loginUser,
//     googleLogin,
//   getProfile,
//   updateProfile,
//   getAllUsers
// };


const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");

/* 🔧 Helper: Format DOB (DD/MM/YYYY) */
const formatDOB = (dob) => {
  return dob ? new Date(dob).toLocaleDateString("en-GB") : null;
};

/* ================= REGISTER USER ================= */
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
        dob: formatDOB(user.dob)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN USER ================= */
const loginUser = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
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
        dob: formatDOB(user.dob),
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GOOGLE LOGIN ================= */
const googleLogin = async (req, res) => {
  try {
    const { idToken, fcmToken, phone, dob } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Google token required"
      });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    if (!email) {
      return res.status(400).json({
        message: "Google account has no email"
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name || "Google User",
        email,
        googleId: uid,
        profilePic: picture || "",
        phone: phone || "",
        dob: dob
          ? new Date(dob.split("/")[2], dob.split("/")[1] - 1, dob.split("/")[0])
          : null,
        fcmToken
      });
    } else {
      if (!user.googleId) user.googleId = uid;
      if (!user.profilePic && picture) user.profilePic = picture;

      if (phone) user.phone = phone;

      if (dob) {
        const parts = dob.split("/");
        user.dob = new Date(parts[2], parts[1] - 1, parts[0]);
      }

      if (fcmToken) user.fcmToken = fcmToken;

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      isProfileComplete: !!(user.phone && user.dob),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: formatDOB(user.dob),
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    res.status(401).json({
      message: "Google auth failed",
      error: error.message
    });
  }
};

/* ================= GET PROFILE ================= */
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
      user: {
        ...user._doc,
        dob: formatDOB(user.dob)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE PROFILE ================= */
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

    if (dob) {
      const parts = dob.split("/");
      user.dob = new Date(parts[2], parts[1] - 1, parts[0]);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: formatDOB(user.dob),
        profilePic: user.profilePic,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL USERS ================= */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      message: "All users fetched successfully",
      count: users.length,
      users: users.map(user => ({
        ...user._doc,
        dob: formatDOB(user.dob)
      }))
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
  updateProfile,
  getAllUsers
};
