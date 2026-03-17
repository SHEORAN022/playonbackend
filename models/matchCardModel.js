const mongoose = require("mongoose");

const matchCardSchema = new mongoose.Schema(
{
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true
  },

  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  matchType: { type: String, enum: ["LIVE","UPCOMING","COMPLETED"], default: "UPCOMING" },
  videoUrl: { type: String, default: "" },

  league: { type: String, required: true },

  team1: { type: String, required: true },
  team2: { type: String, required: true },

  team1Logo: { type: String, required: true },
  team2Logo: { type: String, required: true },

  matchDate: { type: Date, required: true },
  matchTime: { type: String },
  venue: { type: String },

  isLive: { type: Boolean, default: false },
  viewers: { type: Number, default: 0 }

},
{ timestamps: true }
);

module.exports = mongoose.model("MatchCard", matchCardSchema);