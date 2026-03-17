const PremiumContent = require("../models/premiumContentModel");
const Category = require("../models/Category");
const uploadToBunny = require("../utils/uploadToBunny");

/* ================= ADD ================= */

exports.addPremiumContent = async (req, res) => {
  try {
    const {
      title,
      category,
      amount,
      discount,
      features
    } = req.body;

    let image = "";
    let videoUrl = "";

    /* ========= IMAGE UPLOAD ========= */
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];

      image = await uploadToBunny(
        file.buffer,
        `premium/images/${Date.now()}-${file.originalname}`
      );
    }

    /* ========= VIDEO UPLOAD ========= */
    if (req.files?.video?.[0]) {
      const file = req.files.video[0];

      videoUrl = await uploadToBunny(
        file.buffer,
        `premium/videos/${Date.now()}-${file.originalname}`
      );
    }

    if (!title || !category || !image || !amount || !discount) {
      return res.status(400).json({
        success: false,
        message: "Title, category, image, amount, discount required"
      });
    }

    // category check
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    /* ========= FEATURES ========= */
    let parsedFeatures = [];

    if (features) {
      parsedFeatures =
        typeof features === "string" ? JSON.parse(features) : features;

      if (!Array.isArray(parsedFeatures)) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array"
        });
      }
    }

    const premiumContent = await PremiumContent.create({
      title,
      imagePath: image,
      category,
      amount,
      discount,
      videoUrl,
      features: parsedFeatures
    });

    res.status(201).json({
      success: true,
      message: "Premium content created",
      data: premiumContent
    });

  } catch (error) {
    console.error("ADD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= UPDATE ================= */

exports.updatePremiumContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await PremiumContent.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      });
    }

    /* ========= IMAGE UPDATE ========= */
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];

      content.imagePath = await uploadToBunny(
        file.buffer,
        `premium/images/${Date.now()}-${file.originalname}`
      );
    }

    /* ========= VIDEO UPDATE ========= */
    if (req.files?.video?.[0]) {
      const file = req.files.video[0];

      content.videoUrl = await uploadToBunny(
        file.buffer,
        `premium/videos/${Date.now()}-${file.originalname}`
      );
    }

    /* ========= NORMAL FIELDS ========= */
    if (req.body.title) content.title = req.body.title;
    if (req.body.category) content.category = req.body.category;
    if (req.body.amount) content.amount = req.body.amount;
    if (req.body.discount) content.discount = req.body.discount;

    if (req.body.features) {
      let parsed =
        typeof req.body.features === "string"
          ? JSON.parse(req.body.features)
          : req.body.features;

      content.features = parsed;
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: content
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= GET ================= */

exports.getAllPremiumContent = async (req, res) => {
  try {
    const data = await PremiumContent
      .find()
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getPremiumContentByCategory = async (req, res) => {
  try {
    const data = await PremiumContent
      .find({ category: req.params.categoryId })
      .populate("category", "title icon");

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getPremiumContentById = async (req, res) => {
  try {
    const data = await PremiumContent
      .findById(req.params.id)
      .populate("category", "title icon");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      });
    }

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= DELETE ================= */

exports.deletePremiumContent = async (req, res) => {
  try {
    const deleted = await PremiumContent.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};