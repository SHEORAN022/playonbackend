



const axios = require("axios");

const uploadToBunny = async (fileBuffer, fileName) => {
  try {
    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const accessKey = process.env.BUNNY_ACCESS_KEY;
    const cdnUrl = process.env.BUNNY_CDN_URL;

    const url = `https://storage.bunnycdn.com/${storageZone}/${fileName}`;

    await axios.put(url, fileBuffer, {
      headers: {
        AccessKey: accessKey,
        "Content-Type": "application/octet-stream"
      },

      // 🔥 VERY IMPORTANT (video ke liye)
      maxContentLength: Infinity,
      maxBodyLength: Infinity,

      timeout: 600000 // 10 min
    });

   return `https://${cdnUrl}/${fileName}`;

  } catch (error) {
    console.error("❌ BUNNY UPLOAD ERROR:", error?.response?.data || error.message);
    throw new Error("Bunny upload failed");
  }
};

module.exports = uploadToBunny;