const Prematch = require("../models/Prematch");
const Subscription = require("../models/Subscription");
const uploadToBunny = require("../utils/uploadToBunny");

/* ================= CREATE PREMATCH ================= */
exports.createPrematch = async (req, res) => {
  try {
    let imageUrl = "";
    let team1Logo = "";
    let team2Logo = "";
    let videoUrl = "";

    // IMAGE
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      imageUrl = await uploadToBunny(
        file.buffer,
        `prematch/images/${Date.now()}-${file.originalname}`
      );
    }

    // TEAM LOGO 1
    if (req.files?.team1Logo?.[0]) {
      const file = req.files.team1Logo[0];
      team1Logo = await uploadToBunny(
        file.buffer,
        `prematch/team1/${Date.now()}-${file.originalname}`
      );
    }

    // TEAM LOGO 2
    if (req.files?.team2Logo?.[0]) {
      const file = req.files.team2Logo[0];
      team2Logo = await uploadToBunny(
        file.buffer,
        `prematch/team2/${Date.now()}-${file.originalname}`
      );
    }

    // VIDEO
    if (req.files?.video?.[0]) {
      const file = req.files.video[0];
      videoUrl = await uploadToBunny(
        file.buffer,
        `prematch/videos/${Date.now()}-${file.originalname}`
      );
    }

    const match = await Prematch.create({
      title: req.body.title,
      category: req.body.category,
      league: req.body.league,
      matchType: req.body.matchType || "UPCOMING",

      team1: req.body.team1,
      team2: req.body.team2,

      isLive: req.body.isLive === "true",
      viewers: req.body.viewers || 0,

      matchDate: req.body.matchDate,
      stadium: req.body.stadium,
      country: req.body.country,
      analysis: req.body.analysis,

      imageUrl,
      team1Logo,
      team2Logo,
      videoUrl,

      // 🔐 LOCK SYSTEM
      isPremium: req.body.isPremium === "true",
      requiredPlan: req.body.requiredPlan || null
    });

    res.status(201).json({
      success: true,
      message: "Prematch created successfully",
      data: match
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= GET ALL (WITH LOCK SYSTEM) ================= */
exports.getAllPrematch = async (req, res) => {
  try {
    const matches = await Prematch.find()
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

    const updated = matches.map((match) => {
      let locked = false;

      const userPlan = userSub?.plan?.title?.toLowerCase();
      const requiredPlan = match.requiredPlan?.toLowerCase();

      if (match.isPremium) {
        if (!userSub) {
          locked = true;
        } else if (requiredPlan && userPlan !== requiredPlan) {
          locked = true;
        }
      }

      return {
        ...match.toObject(),
        locked
      };
    });

    res.status(200).json({
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
exports.getSinglePrematch = async (req, res) => {
  try {
    const match = await Prematch.findById(req.params.id)
      .populate("category", "title icon");

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= UPDATE ================= */
exports.updatePrematch = async (req, res) => {
  try {
    const match = await Prematch.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    // IMAGE
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      match.imageUrl = await uploadToBunny(
        file.buffer,
        `prematch/images/${Date.now()}-${file.originalname}`
      );
    }

    // LOGOS
    if (req.files?.team1Logo?.[0]) {
      const file = req.files.team1Logo[0];
      match.team1Logo = await uploadToBunny(
        file.buffer,
        `prematch/team1/${Date.now()}-${file.originalname}`
      );
    }

    if (req.files?.team2Logo?.[0]) {
      const file = req.files.team2Logo[0];
      match.team2Logo = await uploadToBunny(
        file.buffer,
        `prematch/team2/${Date.now()}-${file.originalname}`
      );
    }

    // VIDEO
    if (req.files?.video?.[0]) {
      const file = req.files.video[0];
      match.videoUrl = await uploadToBunny(
        file.buffer,
        `prematch/videos/${Date.now()}-${file.originalname}`
      );
    }

    // UPDATE FIELDS
    match.title = req.body.title || match.title;
    match.category = req.body.category || match.category;
    match.league = req.body.league || match.league;
    match.matchType = req.body.matchType || match.matchType;

    match.team1 = req.body.team1 || match.team1;
    match.team2 = req.body.team2 || match.team2;

    match.isLive = req.body.isLive === "true" ? true : match.isLive;
    match.viewers = req.body.viewers ?? match.viewers;

    match.matchDate = req.body.matchDate || match.matchDate;
    match.stadium = req.body.stadium || match.stadium;
    match.country = req.body.country || match.country;
    match.analysis = req.body.analysis || match.analysis;

    // 🔐 LOCK UPDATE
    if (req.body.isPremium !== undefined) {
      match.isPremium = req.body.isPremium === "true";
    }

    if (req.body.requiredPlan !== undefined) {
      match.requiredPlan = req.body.requiredPlan || null;
    }

    await match.save();

    res.status(200).json({
      success: true,
      message: "Prematch updated successfully",
      data: match
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
exports.deletePrematch = async (req, res) => {
  try {
    const match = await Prematch.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    await match.deleteOne();

    res.status(200).json({
      success: true,
      message: "Prematch deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= TOGGLE LIVE ================= */
exports.toggleLive = async (req, res) => {
  try {
    const match = await Prematch.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    match.isLive = !match.isLive;
    match.matchType = match.isLive ? "LIVE" : "UPCOMING";

    await match.save();

    res.status(200).json({
      success: true,
      message: "Live status updated",
      data: match
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= CATEGORY FILTER (WITH LOCK) ================= */
exports.getMatchesByCategory = async (req, res) => {
  try {
    const matches = await Prematch.find({
      category: req.params.categoryId
    })
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

    const updated = matches.map((match) => {
      let locked = false;

      const userPlan = userSub?.plan?.title?.toLowerCase();
      const requiredPlan = match.requiredPlan?.toLowerCase();

      if (match.isPremium) {
        if (!userSub) {
          locked = true;
        } else if (requiredPlan && userPlan !== requiredPlan) {
          locked = true;
        }
      }

      return {
        ...match.toObject(),
        locked
      };
    });

    res.status(200).json({
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