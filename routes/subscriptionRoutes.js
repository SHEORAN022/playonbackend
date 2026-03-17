const express = require("express");
const router = express.Router();

// user middleware
const { protectUser } = require("../middleware/auth");

// admin middleware
const { protectAdmin } = require("../middleware/authMiddleware");

const {
  mySubscription,
  allSubscriptions,
  subscriptionDetails,
  deleteSubscription,
  adminDashboard,
  createSubscription
} = require("../controllers/subscriptionController");

// user
router.post("/create", protectUser, createSubscription);
router.get("/my", protectUser, mySubscription);

// admin
router.get("/all", protectAdmin, allSubscriptions);

router.get("/dashboard/stats", protectAdmin, adminDashboard);

router.get("/:id", protectAdmin, subscriptionDetails);

router.delete("/:id", protectAdmin, deleteSubscription);

module.exports = router;