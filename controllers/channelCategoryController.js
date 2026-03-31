const ChannelCategory = require("../models/channelCategoryModel");

// ➕ Add Category
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const exists = await ChannelCategory.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = await ChannelCategory.create({ name });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 📄 Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await ChannelCategory.find({ status: "Active" })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ✏️ Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const updated = await ChannelCategory.findByIdAndUpdate(
      id,
      { name, status },
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ❌ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await ChannelCategory.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
