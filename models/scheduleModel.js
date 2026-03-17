const mongoose = require("mongoose");

/* ================= MATCH SCHEMA ================= */

const matchSchema = new mongoose.Schema({

  team1: {
    type: String,
    required: true,
    trim: true
  },

  team2: {
    type: String,
    required: true,
    trim: true
  },

  team1Logo: {
    type: String,
    default: ""   // cloudinary url
  },

  team2Logo: {
    type: String,
    default: ""   // cloudinary url
  },

  matchBanner: {
    type: String,
    default: ""   // cloudinary url
  },

  matchDateTime: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["Upcoming", "Live", "Finished"],
    default: "Upcoming"
  },

  isLive: {
    type: Boolean,
    default: false
  },

  viewers: {
    type: Number,
    default: 0
  },

  liveUrl: {
    type: String,
    default: ""
  },

  sport: {
    type: String,
    default: ""
  },

  country: {
    type: String,
    default: ""
  }

}, { _id: true });



/* ================= SECTION SCHEMA ================= */

const sectionSchema = new mongoose.Schema({

  title: {
    type: String,
    default: ""
  },

  date: {
    type: String,
    default: ""
  },

  matches: [matchSchema]

}, { _id: false });



/* ================= MAIN SCHEDULE ================= */

const scheduleSchema = new mongoose.Schema({

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true
  },

  leagueName: {
    type: String,
    required: true,
    trim: true
  },

  leagueLogo: {
    type: String,
    default: ""   // cloudinary url
  },

  leagueBanner: {
    type: String,
    default: ""   // cloudinary url
  },

  sections: [sectionSchema]

}, { timestamps: true });


module.exports = mongoose.model("Schedule", scheduleSchema);