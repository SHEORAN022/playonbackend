const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers
} = require("../controllers/userController");

const { protectUser } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protectUser, getProfile);
router.put("/profile", protectUser, updateProfile);
router.get("/", protectUser, getAllUsers);

module.exports = router;