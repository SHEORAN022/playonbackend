// const mongoose = require("mongoose");

// const liveTvSchema = new mongoose.Schema({
  
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },

//   logo: {
//     type: String, // cloudinary image url
//     required: true
//   },

//   streamUrl: {
//     type: String, // m3u8 or youtube or iframe stream
//     required: true
//   },

//   category: {
//     type: String,
//     enum: ["News", "Sports", "Entertainment", "Movies", "Music", "Kids", "Religious", "Other"],
//     default: "Other"
//   },

//   language: {
//     type: String,
//     default: "Hindi"
//   },

//   country: {
//     type: String,
//     default: "India"
//   },

//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "active"
//   },

//   viewers: {
//     type: Number,
//     default: 0
//   },

//   isPremium: {
//     type: Boolean,
//     default: false   // premium channels future use
//   },
//   requiredPlan: {
//     type: String,
//     default: null
//   },

//   order: {
//     type: Number,
//     default: 0  // admin sorting ke liye
//   },

//   description: {
//     type: String,
//     default: ""
//   }

// }, { timestamps: true });

// module.exports = mongoose.model("LiveTV", liveTvSchema);


const mongoose = require("mongoose");

const liveTvSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  logo: {
    type: String,
    required: true
  },

  /* STREAM URL */

  streamUrl: {
    type: String,
    default: ""
  },

  /* VIDEO FILE */

  videoUrl: {
    type: String,
    default: ""
  },

  streamType: {
    type: String,
    enum: ["url", "video"],
    default: "url"
  },

  category: {
    type: String,
    enum: [
      "News",
      "Sports",
      "Entertainment",
      "Movies",
      "Music",
      "Kids",
      "Religious",
      "Other"
    ],
    default: "Other"
  },

  language: {
    type: String,
    default: "Hindi"
  },

  country: {
    type: String,
    default: "India"
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  viewers: {
    type: Number,
    default: 0
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  requiredPlan: {
    type: String,
    default: null
  },

  order: {
    type: Number,
    default: 0
  },

  description: {
    type: String,
    default: ""
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("LiveTV", liveTvSchema);