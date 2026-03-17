

const mongoose = require("mongoose");

const highlightCategorySchema = new mongoose.Schema(
{
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
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
  }

},
{ timestamps: true }
);

module.exports =
  mongoose.models.HighlightCategory ||
  mongoose.model("HighlightCategory", highlightCategorySchema);