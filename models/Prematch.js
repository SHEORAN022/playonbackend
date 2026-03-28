const mongoose = require("mongoose");

const prematchSchema = new mongoose.Schema({

  title: String,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  league: String,

  matchType: {
    type: String,
    enum: ["UPCOMING", "LIVE", "FINISHED"],
    default: "UPCOMING"
  },

  team1: String,
  team2: String,

  team1Logo: String,
  team2Logo: String,

  imageUrl: String,
  videoUrl: String,

  isLive: {
    type: Boolean,
    default: false
  },

  viewers: {
    type: Number,
    default: 0
  },

  matchDate: Date,
  stadium: String,
  country: String,
  analysis: String,

  /* 🔐 LOCK SYSTEM */
  isPremium: {
    type: Boolean,
    default: false
  },

  requiredPlan: {
    type: String,
    enum: ["Ads Free", "Ads Free + Content Free", null],
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Prematch", prematchSchema);