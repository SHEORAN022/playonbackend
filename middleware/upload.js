

// const multer = require("multer");

// const storage = multer.memoryStorage();

// const upload = multer({ storage });

// module.exports = upload;




const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  // 🔥 FILE SIZE LIMIT
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  },

  // 🔥 FILE TYPE FILTER
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/mkv",
      "video/quicktime"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"), false);
    }
  }
});

module.exports = upload;