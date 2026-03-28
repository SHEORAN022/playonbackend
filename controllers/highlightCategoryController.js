const HighlightCategory = require("../models/highlightCategoryModel");
const Category = require("../models/Category");
const Subscription = require("../models/Subscription");
const uploadToBunny = require("../utils/uploadToBunny");


/* ================= ADD ================= */

exports.addHighlightCategory = async (req, res) => {
  try {
    const { category, title, description, image: imageUrl, isPremium, requiredPlan, status } = req.body;

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

    if (req.file) {
      const fileName = `highlight-categories/${Date.now()}-${req.file.originalname}`;
      image = await uploadToBunny(req.file.buffer, fileName);
    } else if (imageUrl) {
      image = imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const newCategory = await HighlightCategory.create({
      category,
      title,
      description,
      image,
      isPremium,
      requiredPlan,
      status
    });

    res.status(201).json({
      success: true,
      message: "Highlight category added successfully",
      data: newCategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================= GET ALL (🔐 LOCK SYSTEM) ================= */

// exports.getHighlightCategories = async (req, res) => {
//   try {
//     const categories = await HighlightCategory
//       .find({ status: "active" })
//       .populate("category", "title icon")
//       .sort({ createdAt: -1 });

//     let userSub = null;

//     if (req.user?.id) {
//       userSub = await Subscription.findOne({
//         user: req.user.id,
//         status: "active",
//         expireAt: { $gt: new Date() }
//       });
//     }

//     const updated = categories.map((cat) => {

//       let locked = false;

//       if (cat.isPremium) {
//         if (!userSub) {
//           locked = true;
//         } else if (
//           cat.requiredPlan &&
//           userSub.plan !== cat.requiredPlan
//         ) {
//           locked = true;
//         }
//       }

//       return {
//         ...cat.toObject(),
//         locked
//       };
//     });

//     res.json({
//       success: true,
//       total: updated.length,
//       data: updated
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const Plan = require("../models/Plan");

exports.getHighlightCategories = async (req, res) => {
  try {
    const categories = await HighlightCategory
      .find({ status: "active" })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    let userSub = null;
    let userPlan = null;

    if (req.user?.id) {
      userSub = await Subscription.findOne({
        user: req.user.id,
        status: "active",
       endDate: { $gt: new Date() } 
      }).populate("plan"); // 🔥 important
    }

    if (userSub?.plan) {
      userPlan = userSub.plan.title; // "Ads Free" etc
    }

    const updated = categories.map((cat) => {

      let locked = false;

      if (cat.isPremium) {
        if (!userSub) {
          locked = true;
        } 
        else if (
          cat.requiredPlan &&
          userPlan !== cat.requiredPlan
        ) {
          locked = true;
        }
      }

      return {
        ...cat.toObject(),
        locked
      };
    });

    res.json({
      success: true,
      total: updated.length,
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= GET SINGLE ================= */

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

    res.json({
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



/* ================= GET BY CATEGORY ================= */

exports.getHighlightCategoryByCategory = async (req, res) => {
  try {
    const categories = await HighlightCategory
      .find({
        category: req.params.categoryId,
        status: "active"
      })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: categories.length,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================= UPDATE ================= */

exports.updateHighlightCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, description, image: imageUrl, isPremium, requiredPlan, status } = req.body;

    let updateData = { category, title, description, isPremium, requiredPlan, status };

    if (category) {
      const categoryExist = await Category.findById(category);
      if (!categoryExist) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }
    }

    if (req.file) {
      const fileName = `highlight-categories/${Date.now()}-${req.file.originalname}`;
      updateData.image = await uploadToBunny(req.file.buffer, fileName);
    } else if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updated = await HighlightCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================= DELETE ================= */

exports.deleteHighlightCategory = async (req, res) => {
  try {
    const deleted = await HighlightCategory.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Highlight category not found"
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};