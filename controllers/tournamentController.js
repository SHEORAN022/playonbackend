const Tournament = require("../models/tournamentModel");
const Category = require("../models/Category");
const Subscription = require("../models/Subscription");
const uploadToBunny = require("../utils/uploadToBunny");


/* =====================================================
   ADD TOURNAMENT (ADMIN)
===================================================== */
exports.addTournament = async (req, res) => {
  try {
    const {
      title,
      category,
      image,
      isPremium,
      requiredPlan,
      status
    } = req.body;

    let imageUrl = image || "";

    // upload to bunny
    if (req.file) {
      imageUrl = await uploadToBunny(
        req.file.buffer,
        `tournaments/${Date.now()}-${req.file.originalname}`
      );
    }

    if (!title || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Title, category and image are required"
      });
    }

    // check category
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const tournament = await Tournament.create({
      title,
      category,
      image: imageUrl,
      isPremium,
      requiredPlan,
      status
    });

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament
    });

  } catch (error) {
    console.log("ADD TOURNAMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* =====================================================
   GET ALL (PUBLIC)
===================================================== */
// exports.getAllTournaments = async (req, res) => {
//   try {
//     const tournaments = await Tournament
//       .find({ status: "active" })
//       .populate("category", "title icon")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       total: tournaments.length,
//       data: tournaments
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament
      .find({ status: "active" })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    let userSub = null;

    // 👉 agar user logged in hai
    if (req.user?.id) {
      userSub = await Subscription.findOne({
        user: req.user.id,
        status: "active",
        expireAt: { $gt: new Date() }
      });
    }

    // 🔥 add locked field
    const updated = tournaments.map((t) => {
      let locked = false;

      if (t.isPremium) {
        if (!userSub) {
          locked = true;
        } else if (
          t.requiredPlan &&
          userSub.plan !== t.requiredPlan
        ) {
          locked = true;
        }
      }

      return {
        ...t.toObject(),
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


/* =====================================================
   GET BY CATEGORY
===================================================== */
exports.getTournamentsByCategory = async (req, res) => {
  try {
    const tournaments = await Tournament
      .find({
        category: req.params.categoryId,
        status: "active"
      })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: tournaments.length,
      data: tournaments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* =====================================================
   GET SINGLE (🔐 LOCK SYSTEM)
===================================================== */
// exports.getSingleTournament = async (req, res) => {
//   try {
//     const tournament = await Tournament
//       .findById(req.params.id)
//       .populate("category", "title icon");

//     if (!tournament) {
//       return res.status(404).json({
//         success: false,
//         message: "Tournament not found"
//       });
//     }

//     /* ========= FREE ========= */
//     if (!tournament.isPremium) {
//       return res.json({
//         success: true,
//         locked: false,
//         data: tournament
//       });
//     }

//     /* ========= PREMIUM ========= */
//     const sub = await Subscription.findOne({
//       user: req.user?.id,
//       status: "active",
//       expireAt: { $gt: new Date() }
//     });

//     if (!sub) {
//       return res.json({
//         success: true,
//         locked: true,
//         message: "Subscription required"
//       });
//     }

//     /* ========= OPTIONAL PLAN CHECK ========= */
//     if (
//       tournament.requiredPlan &&
//       sub.plan !== tournament.requiredPlan
//     ) {
//       return res.json({
//         success: true,
//         locked: true,
//         message: `Upgrade to ${tournament.requiredPlan} plan`
//       });
//     }

//     /* ========= UNLOCK ========= */
//     res.json({
//       success: true,
//       locked: false,
//       data: tournament
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };
exports.getSingleTournament = async (req, res) => {
  try {
    const tournament = await Tournament
      .findById(req.params.id)
      .populate("category", "title icon");

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    res.json({
      success: true,
      data: tournament
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/* =====================================================
   UPDATE TOURNAMENT (ADMIN)
===================================================== */
exports.updateTournament = async (req, res) => {
  try {
    const {
      title,
      category,
      image,
      isPremium,
      requiredPlan,
      status
    } = req.body;

    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    if (title) tournament.title = title;
    if (category) tournament.category = category;
    if (status) tournament.status = status;

    if (isPremium !== undefined) {
      tournament.isPremium = isPremium;
    }

    if (requiredPlan !== undefined) {
      tournament.requiredPlan = requiredPlan;
    }

    // image upload
    if (req.file) {
      tournament.image = await uploadToBunny(
        req.file.buffer,
        `tournaments/${Date.now()}-${req.file.originalname}`
      );
    } else if (image) {
      tournament.image = image;
    }

    await tournament.save();

    res.json({
      success: true,
      message: "Tournament updated successfully",
      data: tournament
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* =====================================================
   DELETE TOURNAMENT
===================================================== */
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found"
      });
    }

    res.json({
      success: true,
      message: "Tournament deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* =====================================================
   TOGGLE PREMIUM (ADMIN 🔥)
===================================================== */
exports.togglePremium = async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id);

    if (!t) {
      return res.status(404).json({
        message: "Tournament not found"
      });
    }

    t.isPremium = !t.isPremium;
    await t.save();

    res.json({
      success: true,
      message: "Premium updated",
      data: t
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};