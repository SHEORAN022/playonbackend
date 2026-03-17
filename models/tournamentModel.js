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
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Tournament", tournamentSchema);