// const mongoose = require("mongoose");

// const bannerSchema = new mongoose.Schema({

//   /* ================= IMAGES (3 max) ================= */
//   images: [{
//     type: String,
//     required: true
//   }],

//   /* ================= TEXT ================= */
//   title: {
//     type: String,
//     default: null,
//     trim: true
//   },

//   description: {
//     type: String,
//     default: null,
//     trim: true
//   },

//   /* ================= STATUS ================= */
//   is_active: {
//     type: Boolean,
//     default: true
//   },

//   /* ================= ORDER ================= */
//   sort_order: {
//     type: Number,
//     default: 0
//   },

//   /* ================= ADMIN ================= */
//   created_by: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Admin",
//     default: null
//   },

//   /* ================= DATES ================= */
//   created_at: {
//     type: Date,
//     default: Date.now
//   },

//   updated_at: {
//     type: Date,
//     default: Date.now
//   }

// });

// module.exports = mongoose.model("Banner", bannerSchema);







const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({

  image: {
    type: String,
    required: true
  },

  title: {
    type: String,
    default: null,
    trim: true
  },

  description: {
    type: String,
    default: null,
    trim: true
  },

  is_active: {
    type: Boolean,
    default: true
  },

  sort_order: {
    type: Number,
    default: 0
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Banner", bannerSchema);