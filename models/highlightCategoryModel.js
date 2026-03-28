const mongoose = require("mongoose");

const highlightCategorySchema = new mongoose.Schema(
{
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    type: String,
    required: true
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
  },

  /* 🔥 OPTIONAL */

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }

},
{ timestamps: true }
);

module.exports =
  mongoose.models.HighlightCategory ||
  mongoose.model("HighlightCategory", highlightCategorySchema);