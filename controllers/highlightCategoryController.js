

const HighlightCategory = require("../models/highlightCategoryModel");
const Category = require("../models/Category");
const uploadToBunny = require("../utils/uploadToBunny");

/* ===============================
   ADD HIGHLIGHT CATEGORY
================================ */
exports.addHighlightCategory = async (req, res) => {
  try {

    const { category, title, description, image: imageUrl } = req.body;

    if (!category || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Category, title and description are required"
      });
    }

    const categoryExist = await Category.findById(category);

    if (!categoryExist) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    let image = "";

    /* FILE UPLOAD */
    if (req.file) {

      const fileName = `highlight-categories/${Date.now()}-${req.file.originalname}`;

      image = await uploadToBunny(req.file.buffer, fileName);
    }

    /* DIRECT URL */
    else if (imageUrl) {
      image = imageUrl;
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const newCategory = await HighlightCategory.create({
      category,
      title,
      description,
      image
    });

    res.status(201).json({
      success: true,
      message: "Highlight category added successfully",
      data: newCategory
    });

  } catch (error) {

    console.log("Add Highlight Category Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ===============================
   GET ALL HIGHLIGHT CATEGORIES
================================ */
exports.getHighlightCategories = async (req, res) => {
  try {

    const categories = await HighlightCategory
      .find()
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ===============================
   GET SINGLE CATEGORY
================================ */
exports.getSingleHighlightCategory = async (req, res) => {
  try {

    const category = await HighlightCategory
      .findById(req.params.id)
      .populate("category", "title icon");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ===============================
   UPDATE CATEGORY
================================ */
exports.updateHighlightCategory = async (req, res) => {
  try {

    const { id } = req.params;
    const { category, title, description, image: imageUrl } = req.body;

    let updateData = { category, title, description };

    if (category) {

      const categoryExist = await Category.findById(category);

      if (!categoryExist) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }

    }

    /* FILE UPLOAD */

    if (req.file) {

      const fileName = `highlight-categories/${Date.now()}-${req.file.originalname}`;

      updateData.image = await uploadToBunny(req.file.buffer, fileName);
    }

    /* DIRECT URL */

    else if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updatedCategory = await HighlightCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Highlight category updated successfully",
      data: updatedCategory
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ===============================
   DELETE CATEGORY
================================ */
exports.deleteHighlightCategory = async (req, res) => {
  try {

    const category = await HighlightCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Highlight category deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ===============================
   GET HIGHLIGHT CATEGORY BY CATEGORY ID
================================ */
exports.getHighlightCategoryByCategory = async (req, res) => {
  try {

    const categories = await HighlightCategory
      .find({ category: req.params.categoryId })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};