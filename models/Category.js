const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    default: ""
  },

  icon: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: ""
  },

  order: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);




// const mongoose = require("mongoose");

// const highlightCategorySchema = new mongoose.Schema(
// {
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true
//   },

//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },

//   description: {
//     type: String,
//     required: true,
//     trim: true
//   },

//   image: {
//     type: String,
//     required: true
//   }

// },
// {
//   timestamps: true
// }
// );

// module.exports = mongoose.model("HighlightCategory", highlightCategorySchema);