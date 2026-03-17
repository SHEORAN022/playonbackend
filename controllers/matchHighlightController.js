




const MatchHighlight = require("../models/MatchHighlight");


/* =========================================================
   ADD HIGHLIGHT (ADMIN)
========================================================= */
exports.addHighlight = async (req, res) => {
  try {

    const {
      categoryId,
      league,
      team1,
      team2,
      team1Logo,
      team2Logo,
      bannerImage,
      videoUrl,
      isLive,
      viewers,
      matchId,
      matchTime,
    } = req.body;

    if (
      !categoryId ||
      !league ||
      !team1 ||
      !team2 ||
      !team1Logo ||
      !team2Logo ||
      !bannerImage ||
      !matchTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const highlight = await MatchHighlight.create({
      categoryId,
      league,
      team1,
      team2,
      team1Logo,
      team2Logo,
      bannerImage,
      videoUrl,
      isLive,
      viewers,
      matchId,
      matchTime,
    });

    res.status(201).json({
      success: true,
      message: "Highlight added successfully",
      data: highlight,
    });

  } catch (err) {
    console.log("Add highlight error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   GET ALL HIGHLIGHTS
========================================================= */
exports.getAllHighlights = async (req, res) => {
  try {

    const highlights = await MatchHighlight
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: highlights.length,
      data: highlights,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   GET HIGHLIGHTS BY CATEGORY  ⭐ (MAIN API)
========================================================= */
exports.getHighlightsByCategory = async (req, res) => {
  try {

    const { categoryId } = req.params;

    const highlights = await MatchHighlight
      .find({ categoryId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: highlights.length,
      data: highlights,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   GET SINGLE HIGHLIGHT
========================================================= */
exports.getSingleHighlight = async (req, res) => {
  try {

    const highlight = await MatchHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    res.json({
      success: true,
      data: highlight,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   UPDATE HIGHLIGHT (ADMIN)
========================================================= */
exports.updateHighlight = async (req, res) => {
  try {

    const highlight = await MatchHighlight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    res.json({
      success: true,
      message: "Highlight updated successfully",
      data: highlight,
    });

  } catch (err) {
    console.log("Update error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   DELETE HIGHLIGHT (ADMIN)
========================================================= */
exports.deleteHighlight = async (req, res) => {
  try {

    const highlight = await MatchHighlight.findByIdAndDelete(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    res.json({
      success: true,
      message: "Highlight deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   TOGGLE LIVE (ADMIN)
========================================================= */
exports.toggleLive = async (req, res) => {
  try {

    const highlight = await MatchHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    highlight.isLive = !highlight.isLive;
    await highlight.save();

    res.json({
      success: true,
      message: "Live status updated",
      data: highlight,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   ADD VIEWER (FLUTTER)
========================================================= */
exports.addViewer = async (req, res) => {
  try {

    const highlight = await MatchHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    highlight.viewers = (highlight.viewers || 0) + 1;
    await highlight.save();

    res.json({
      success: true,
      viewers: highlight.viewers,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};