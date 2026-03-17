

const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/adminAuthController");

const {
  protectAdmin,
  adminOnly
} = require("../middleware/authMiddleware");


// auth
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);


// private
router.get("/profile", protectAdmin, adminOnly, getProfile);
router.put("/update-profile", protectAdmin, adminOnly, updateProfile);
router.put("/change-password", protectAdmin, adminOnly, changePassword);

module.exports = router;