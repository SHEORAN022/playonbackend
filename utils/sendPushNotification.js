const admin = require("../config/firebase");

const sendPushNotification = async (token, title, body) => {

  const message = {
    notification: {
      title: title,
      body: body
    },
    token: token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
  } catch (error) {
    console.log("Notification error:", error);
  }

};

module.exports = sendPushNotification;