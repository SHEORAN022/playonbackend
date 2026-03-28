



const mongoose = require("mongoose");

/* ================= MATCH ================= */

const matchSchema = new mongoose.Schema({

  team1: { type: String, required: true },
  team2: { type: String, required: true },
    team1Logo: { type: String, default: "" },     // ✅ ADD
  team2Logo: { type: String, default: "" },     // ✅ ADD
  matchBanner: { type: String, default: "" },   // ✅ ADD

  matchDateTime: { type: Date, required: true },

  liveUrl: { type: String, default: "" },
    viewers: { type: Number, default: 0 }, 
  isLive: {
  type: Boolean,
  default: false
},
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

}, { _id: true });


/* ================= SECTION ================= */

const sectionSchema = new mongoose.Schema({
  title: String,
  date: String,
  matches: [matchSchema]
}, { _id: false });


/* ================= MAIN ================= */

const scheduleSchema = new mongoose.Schema({

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  leagueName: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  sections: [sectionSchema]

}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);