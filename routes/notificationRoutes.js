const express = require("express");
const router = express.Router();

const {
  sendNotificationToAll,
  getNotifications
} = require("../controllers/notificationController");

// Send notification
router.post("/send", sendNotificationToAll);

// Get all notifications
router.get("/", getNotifications);

module.exports = router;