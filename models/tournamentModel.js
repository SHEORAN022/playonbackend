const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    type: String,
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  /* 🔐 LOCK SYSTEM */

  isPremium: {
    type: Boolean,
    default: false
  },

  requiredPlan: {
    type: String,
    enum: ["basic", "pro", "vip", null],
    default: null
  },

  /* 📊 OPTIONAL FUTURE USE */

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

 

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Tournament", tournamentSchema);