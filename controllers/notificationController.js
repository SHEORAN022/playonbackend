

const admin = require("../config/firebase");
const User = require("../models/User");

let notifications = [];

/* ================= SEND NOTIFICATION TO ALL USERS ================= */

const sendNotificationToAll = async (req, res) => {
  try {

    const { title, message } = req.body;

    // validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required"
      });
    }

    // fetch users having FCM token
    const users = await User.find({
      fcmToken: { $exists: true, $ne: null }
    });

    let tokens = users.map(user => user.fcmToken);

    // remove duplicate tokens
    tokens = [...new Set(tokens)];

    if (tokens.length === 0) {
      return res.json({
        success: false,
        message: "No FCM tokens found"
      });
    }

    const time = new Date().toISOString();

    /* SEND FCM NOTIFICATION */

    const response = await admin.messaging().sendEachForMulticast({
      tokens: tokens,

      notification: {
        title: title,
        body: message
      },

      data: {
        time: time
      },

      android: {
        priority: "high"
      },

      apns: {
        payload: {
          aps: {
            sound: "default"
          }
        }
      }

    });

    let invalidTokens = [];

    /* CHECK ERRORS */

    response.responses.forEach((resp, index) => {

      if (!resp.success) {

        console.log("❌ FCM Error Token:", tokens[index]);
        console.log("❌ Code:", resp.error.code);
        console.log("❌ Message:", resp.error.message);

        if (
          resp.error.code === "messaging/invalid-registration-token" ||
          resp.error.code === "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(tokens[index]);
        }

      }

    });

    /* REMOVE INVALID TOKENS FROM DATABASE */

    if (invalidTokens.length > 0) {

      await User.updateMany(
        { fcmToken: { $in: invalidTokens } },
        { $unset: { fcmToken: "" } }
      );

    }

    /* SAVE NOTIFICATION HISTORY */

    notifications.push({
      title,
      message,
      time
    });

    res.json({
      success: true,
      message: "Notification processed",
      totalTokens: tokens.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
      removedInvalidTokens: invalidTokens.length,
      time
    });

  } catch (error) {

    console.error("Notification Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ================= GET NOTIFICATION HISTORY ================= */

const getNotifications = async (req, res) => {

  try {

    res.json({
      success: true,
      total: notifications.length,
      notifications
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* ================= EXPORT ================= */

module.exports = {
  sendNotificationToAll,
  getNotifications
};