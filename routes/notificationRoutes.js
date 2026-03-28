
const express = require("express");
const router = express.Router();

const sendNotification = require("../utils/oneSignal");

/* ================= SEND NOTIFICATION ================= */

// 🔔 Send to specific users
router.post("/send", async (req, res) => {
  try {
    const { playerIds, title, message } = req.body;

    // validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required"
      });
    }

    // agar playerIds nahi bheja → sabko send kare
    let result;

    if (playerIds && playerIds.length > 0) {
      result = await sendNotification(playerIds, title, message);
    } else {
      result = await sendNotification(null, title, message); // all users
    }

    res.json({
      success: true,
      message: "Notification sent successfully 🔥",
      data: result
    });

  } catch (error) {
    console.error("Notification Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;