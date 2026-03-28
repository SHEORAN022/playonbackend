const axios = require("axios");

const sendNotification = async (playerIds, title, message) => {
  try {
    const body = {
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message }
    };

    if (playerIds && playerIds.length > 0) {
      body.include_subscription_ids = playerIds;
    } else {
      body.included_segments = ["All"];
    }

    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      body,
      {
        headers: {
          Authorization: `Key ${process.env.ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ OneSignal Response:", response.data);
    return response.data;

//   } catch (error) {
//     console.log("❌ OneSignal Error:", error.response?.data || error.message);
//     throw error; // ✅ just throw — route will catch it
//   }
} catch (error) {
  console.log("❌ OneSignal Error:", JSON.stringify(error.response?.data, null, 2));
  throw new Error(JSON.stringify(error.response?.data) || error.message);
}
};

module.exports = sendNotification;

