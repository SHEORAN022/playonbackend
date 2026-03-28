

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  googleLogin,
  getAllUsers
} = require("../controllers/userController");

const { protectUser } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protectUser, getProfile);
router.put("/profile", protectUser, updateProfile);
router.get("/", protectUser, getAllUsers);
router.post("/google-login", googleLogin);

module.exports = router;
