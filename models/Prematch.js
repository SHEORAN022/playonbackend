const mongoose = require("mongoose");

const prematchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  imageUrl: {
    type: String,
    default: ""
  },

  videoUrl: {
    type: String,
    default: ""
  },

  league: {
    type: String,
    default: ""
  },

  matchType: {
    type: String,
    enum: ["LIVE", "UPCOMING", "COMPLETED"],
    default: "UPCOMING"
  },

  team1: {
    type: String,
    required: true
  },

  team2: {
    type: String,
    required: true
  },

  team1Logo: String,
  team2Logo: String,

  isLive: {
    type: Boolean,
    default: false
  },

  viewers: {
    type: Number,
    default: 0
  },

  matchDate: {
    type: Date
  },

  stadium: String,
  country: String,

  analysis: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("Prematch", prematchSchema);