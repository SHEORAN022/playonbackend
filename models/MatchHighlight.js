


// const mongoose = require("mongoose");

// const matchHighlightSchema = new mongoose.Schema(
// {
//   league: {
//     type: String,
//     required: true
//   },

//   team1: {
//     type: String,
//     required: true
//   },

//   team2: {
//     type: String,
//     required: true
//   },

//   team1Logo: {
//     type: String,
//     required: true
//   },

//   team2Logo: {
//     type: String,
//     required: true
//   },

//   bannerImage: {
//     type: String,
//     required: true
//   },

//   videoUrl: String,

//   isLive: {
//     type: Boolean,
//     default: false
//   },

//   viewers: {
//     type: Number,
//     default: 0
//   },

//   matchId: String,

//   matchTime: {
//     type: String,
//     required: true
//   }

// },
// { timestamps:true }
// );

// module.exports = mongoose.model("MatchHighlight", matchHighlightSchema);







const mongoose = require("mongoose");

const matchHighlightSchema = new mongoose.Schema(
{
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HighlightCategory",
    required: true
  },

  league: {
    type: String,
    required: true
  },

  team1: {
    type: String,
    required: true
  },

  team2: {
    type: String,
    required: true
  },

  team1Logo: {
    type: String,
    required: true
  },

  team2Logo: {
    type: String,
    required: true
  },

  bannerImage: {
    type: String,
    required: true
  },

  videoUrl: String,

  isLive: {
    type: Boolean,
    default: false
  },

  viewers: {
    type: Number,
    default: 0
  },

  matchId: String,

  matchTime: {
    type: String,
    required: true
  }

},
{ timestamps:true }
);

module.exports = mongoose.model("MatchHighlight", matchHighlightSchema);