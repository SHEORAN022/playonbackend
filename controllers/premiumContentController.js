// const PremiumContent = require("../models/premiumContentModel");
// const Category = require("../models/Category");
// const Subscription = require("../models/Subscription");
// const uploadToBunny = require("../utils/uploadToBunny");

// /* ================= ADD ================= */
// exports.addPremiumContent = async (req, res) => {
//   try {
//     const { title, category, amount, discount, features } = req.body;

//     let image = "";
//     let videoUrl = "";

//     // IMAGE
//     if (req.files?.image?.[0]) {
//       const file = req.files.image[0];
//       image = await uploadToBunny(
//         file.buffer,
//         `premium/images/${Date.now()}-${file.originalname}`
//       );
//     }

//     // VIDEO
//     if (req.files?.video?.[0]) {
//       const file = req.files.video[0];
//       videoUrl = await uploadToBunny(
//         file.buffer,
//         `premium/videos/${Date.now()}-${file.originalname}`
//       );
//     }

//     if (!title || !category || !image || !amount || !discount) {
//       return res.status(400).json({
//         success: false,
//         message: "title, category, image, amount, discount required"
//       });
//     }

//     // category check
//     const categoryExist = await Category.findById(category);
//     if (!categoryExist) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found"
//       });
//     }

//     // FEATURES PARSE
//     let parsedFeatures = [];
//     if (features) {
//       parsedFeatures =
//         typeof features === "string" ? JSON.parse(features) : features;

//       if (!Array.isArray(parsedFeatures)) {
//         return res.status(400).json({
//           success: false,
//           message: "Features must be array"
//         });
//       }
//     }

//     const data = await PremiumContent.create({
//       title,
//       imagePath: image,
//       category,
//       amount,
//       discount,
//       videoUrl,
//       features: parsedFeatures,

//       // 🔐 LOCK SYSTEM
//       isPremium: req.body.isPremium === "true",
//       requiredPlan: req.body.requiredPlan || null
//     });

//     res.status(201).json({
//       success: true,
//       message: "Premium content created",
//       data
//     });

//   } catch (error) {
//     console.error("ADD ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// /* ================= GET ALL (LOCK SYSTEM) ================= */
// exports.getAllPremiumContent = async (req, res) => {
//   try {
//     const contents = await PremiumContent
//       .find({ status: "active" })
//       .populate("category", "title icon")
//       .sort({ createdAt: -1 });

//     let userSub = null;

//     if (req.user?.id) {
//       userSub = await Subscription.findOne({
//         user: req.user.id,
//         status: "active",
//         endDate: { $gt: new Date() }
//       }).populate("plan");
//     }

//     const updated = contents.map((item) => {
//       let locked = false;

//       const userPlan = userSub?.plan?.title?.toLowerCase();
//       const requiredPlan = item.requiredPlan?.toLowerCase();

//       if (item.isPremium) {
//         if (!userSub) {
//           locked = true;
//         } else if (requiredPlan && userPlan !== requiredPlan) {
//           locked = true;
//         }
//       }

//       return {
//         ...item.toObject(),
//         locked
//       };
//     });

//     res.json({
//       success: true,
//       count: updated.length,
//       data: updated
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// /* ================= GET BY CATEGORY ================= */
// exports.getPremiumContentByCategory = async (req, res) => {
//   try {
//     const contents = await PremiumContent
//       .find({
//         category: req.params.categoryId,
//         status: "active"
//       })
//       .populate("category", "title icon");

//     let userSub = null;

//     if (req.user?.id) {
//       userSub = await Subscription.findOne({
//         user: req.user.id,
//         status: "active",
//         endDate: { $gt: new Date() }
//       }).populate("plan");
//     }

//     const updated = contents.map((item) => {
//       let locked = false;

//       const userPlan = userSub?.plan?.title?.toLowerCase();
//       const requiredPlan = item.requiredPlan?.toLowerCase();

//       if (item.isPremium) {
//         if (!userSub) locked = true;
//         else if (requiredPlan && userPlan !== requiredPlan) locked = true;
//       }

//       return {
//         ...item.toObject(),
//         locked
//       };
//     });

//     res.json({
//       success: true,
//       count: updated.length,
//       data: updated
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// /* ================= GET SINGLE ================= */
// exports.getPremiumContentById = async (req, res) => {
//   try {
//     const item = await PremiumContent
//       .findById(req.params.id)
//       .populate("category", "title icon");

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Not found"
//       });
//     }

//     // 🔐 LOCK CHECK
//     let locked = false;

//     let userSub = null;
//     if (req.user?.id) {
//       userSub = await Subscription.findOne({
//         user: req.user.id,
//         status: "active",
//         endDate: { $gt: new Date() }
//       }).populate("plan");
//     }

//     const userPlan = userSub?.plan?.title?.toLowerCase();
//     const requiredPlan = item.requiredPlan?.toLowerCase();

//     if (item.isPremium) {
//       if (!userSub) locked = true;
//       else if (requiredPlan && userPlan !== requiredPlan) locked = true;
//     }

//     res.json({
//       success: true,
//       data: {
//         ...item.toObject(),
//         locked
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// /* ================= UPDATE ================= */
// exports.updatePremiumContent = async (req, res) => {
//   try {
//     const item = await PremiumContent.findById(req.params.id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Not found"
//       });
//     }

//     // IMAGE
//     if (req.files?.image?.[0]) {
//       const file = req.files.image[0];
//       item.imagePath = await uploadToBunny(
//         file.buffer,
//         `premium/images/${Date.now()}-${file.originalname}`
//       );
//     }

//     // VIDEO
//     if (req.files?.video?.[0]) {
//       const file = req.files.video[0];
//       item.videoUrl = await uploadToBunny(
//         file.buffer,
//         `premium/videos/${Date.now()}-${file.originalname}`
//       );
//     }

//     // UPDATE FIELDS
//     if (req.body.title) item.title = req.body.title;
//     if (req.body.category) item.category = req.body.category;
//     if (req.body.amount) item.amount = req.body.amount;
//     if (req.body.discount) item.discount = req.body.discount;

//     if (req.body.features) {
//       item.features =
//         typeof req.body.features === "string"
//           ? JSON.parse(req.body.features)
//           : req.body.features;
//     }

//     // 🔐 LOCK UPDATE
//     if (req.body.isPremium !== undefined) {
//       item.isPremium = req.body.isPremium === "true";
//     }

//     if (req.body.requiredPlan !== undefined) {
//       item.requiredPlan = req.body.requiredPlan || null;
//     }

//     await item.save();

//     res.json({
//       success: true,
//       message: "Updated successfully",
//       data: item
//     });

//   } catch (error) {
//     console.error("UPDATE ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// /* ================= DELETE ================= */
// exports.deletePremiumContent = async (req, res) => {
//   try {
//     const deleted = await PremiumContent.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Deleted successfully"
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



const PremiumContent = require("../models/premiumContentModel");
const Category = require("../models/Category");
const Subscription = require("../models/Subscription");
const uploadToBunny = require("../utils/uploadToBunny");

/* ================= ADD ================= */
exports.addPremiumContent = async (req, res) => {
  try {
    const {
      title,
      category,
      amount,
      discount,
      features,
      imagePath,
      isPremium,
      requiredPlan
    } = req.body;

    let image = "";
    let videoUrl = "";

    /* ========= IMAGE ========= */

    // ✅ FILE UPLOAD
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      image = await uploadToBunny(
        file.buffer,
        `premium/images/${Date.now()}-${file.originalname}`
      );
    }

    // ✅ DIRECT URL SUPPORT (🔥 FIX)
    else if (imagePath) {
      image = imagePath;
    }

    /* ========= VIDEO ========= */

    if (req.files?.video?.[0]) {
      const file = req.files.video[0];
      videoUrl = await uploadToBunny(
        file.buffer,
        `premium/videos/${Date.now()}-${file.originalname}`
      );
    } else if (req.body.videoUrl) {
      videoUrl = req.body.videoUrl;
    }

    /* ========= VALIDATION ========= */

    if (!title || !category || !image || !amount || !discount) {
      return res.status(400).json({
        success: false,
        message: "title, category, image, amount, discount required"
      });
    }

    /* ========= CATEGORY CHECK ========= */

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
          message: "Features must be array"
        });
      }
    }

    /* ========= CREATE ========= */

    const data = await PremiumContent.create({
      title,
      imagePath: image,
      category,
      amount,
      discount,
      videoUrl,
      features: parsedFeatures,

      // 🔐 LOCK SYSTEM
      isPremium: isPremium === "true" || isPremium === true,
      requiredPlan: requiredPlan || null
    });

    res.status(201).json({
      success: true,
      message: "Premium content created successfully",
      data
    });

  } catch (error) {
    console.error("ADD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================= GET ALL (LOCK SYSTEM) ================= */
exports.getAllPremiumContent = async (req, res) => {
  try {
    const contents = await PremiumContent
      .find({ status: "active" })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    let userSub = null;

    if (req.user?.id) {
      userSub = await Subscription.findOne({
        user: req.user.id,
        status: "active",
        endDate: { $gt: new Date() }
      }).populate("plan");
    }

    const updated = contents.map((item) => {
      let locked = false;

      const userPlan = userSub?.plan?.title?.toLowerCase();
      const requiredPlan = item.requiredPlan?.toLowerCase();

      if (item.isPremium) {
        if (!userSub) locked = true;
        else if (requiredPlan && userPlan !== requiredPlan) locked = true;
      }

      return {
        ...item.toObject(),
        locked
      };
    });

    res.json({
      success: true,
      count: updated.length,
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================= GET BY CATEGORY ================= */
exports.getPremiumContentByCategory = async (req, res) => {
  try {
    const contents = await PremiumContent
      .find({
        category: req.params.categoryId,
        status: "active"
      })
      .populate("category", "title icon");

    let userSub = null;

    if (req.user?.id) {
      userSub = await Subscription.findOne({
        user: req.user.id,
        status: "active",
        endDate: { $gt: new Date() }
      }).populate("plan");
    }

    const updated = contents.map((item) => {
      let locked = false;

      const userPlan = userSub?.plan?.title?.toLowerCase();
      const requiredPlan = item.requiredPlan?.toLowerCase();

      if (item.isPremium) {
        if (!userSub) locked = true;
        else if (requiredPlan && userPlan !== requiredPlan) locked = true;
      }

      return {
        ...item.toObject(),
        locked
      };
    });

    res.json({
      success: true,
      count: updated.length,
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
exports.getPremiumContentById = async (req, res) => {
  try {
    const item = await PremiumContent
      .findById(req.params.id)
      .populate("category", "title icon");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      });
    }

    let locked = false;
    let userSub = null;

    if (req.user?.id) {
      userSub = await Subscription.findOne({
        user: req.user.id,
        status: "active",
        endDate: { $gt: new Date() }
      }).populate("plan");
    }

    const userPlan = userSub?.plan?.title?.toLowerCase();
    const requiredPlan = item.requiredPlan?.toLowerCase();

    if (item.isPremium) {
      if (!userSub) locked = true;
      else if (requiredPlan && userPlan !== requiredPlan) locked = true;
    }

    res.json({
      success: true,
      data: {
        ...item.toObject(),
        locked
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ================= UPDATE ================= */
exports.updatePremiumContent = async (req, res) => {
  try {
    const item = await PremiumContent.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      });
    }

    /* ========= IMAGE ========= */
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      item.imagePath = await uploadToBunny(
        file.buffer,
        `premium/images/${Date.now()}-${file.originalname}`
      );
    } else if (req.body.imagePath) {
      item.imagePath = req.body.imagePath;
    }

    /* ========= VIDEO ========= */
    if (req.files?.video?.[0]) {
      const file = req.files.video[0];
      item.videoUrl = await uploadToBunny(
        file.buffer,
        `premium/videos/${Date.now()}-${file.originalname}`
      );
    } else if (req.body.videoUrl) {
      item.videoUrl = req.body.videoUrl;
    }

    /* ========= NORMAL FIELDS ========= */
    if (req.body.title) item.title = req.body.title;
    if (req.body.category) item.category = req.body.category;
    if (req.body.amount) item.amount = req.body.amount;
    if (req.body.discount) item.discount = req.body.discount;

    if (req.body.features) {
      item.features =
        typeof req.body.features === "string"
          ? JSON.parse(req.body.features)
          : req.body.features;
    }

    /* 🔐 LOCK UPDATE */
    if (req.body.isPremium !== undefined) {
      item.isPremium =
        req.body.isPremium === "true" || req.body.isPremium === true;
    }

    if (req.body.requiredPlan !== undefined) {
      item.requiredPlan = req.body.requiredPlan || null;
    }

    await item.save();

    res.json({
      success: true,
      message: "Updated successfully",
      data: item
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};