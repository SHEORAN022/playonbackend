const MatchCard = require("../models/matchCardModel");
const mongoose = require("mongoose");


/* ===============================
   ➕ ADD MATCH
================================ */

exports.addMatch = async (req, res) => {
  try {

    const {
      tournamentId,
      title,
      matchType,
      videoUrl,
      league,
      team1,
      team2,
      matchDate,
      matchTime,
      venue,
      isLive
    } = req.body;

    // uploaded images from cloudinary
    const imageUrl = req.files?.imageUrl?.[0]?.path || "";
    const team1Logo = req.files?.team1Logo?.[0]?.path || "";
    const team2Logo = req.files?.team2Logo?.[0]?.path || "";

    // validation
    if (!tournamentId || !title || !team1 || !team2) {
      return res.status(400).json({
        success: false,
        message: "tournamentId, title, team1, team2 are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tournamentId"
      });
    }

    const match = await MatchCard.create({
      tournamentId,
      title,
      imageUrl,
      matchType,
      videoUrl,
      league,
      team1,
      team2,
      team1Logo,
      team2Logo,
      matchDate,
      matchTime,
      venue,
      isLive
    });

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      data: match
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ===============================
   📋 GET ALL MATCHES
================================ */

exports.getAllMatches = async (req, res) => {
  try {

    const matches = await MatchCard
      .find({ tournamentId: { $ne: null } })
      .populate("tournamentId", "title")
      .sort({ matchDate: 1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ===============================
   📋 GET MATCHES BY TOURNAMENT
================================ */

exports.getMatchesByTournament = async (req, res) => {
  try {

    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tournamentId"
      });
    }

    const matches = await MatchCard
      .find({ tournamentId })
      .sort({ matchDate: 1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ===============================
   🔍 GET SINGLE MATCH
================================ */

exports.getSingleMatch = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid match id"
      });
    }

    const match = await MatchCard
      .findById(id)
      .populate("tournamentId", "title");

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



/* ===============================
   ✏ UPDATE MATCH
================================ */

exports.updateMatch = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid match id"
      });
    }

    const match = await MatchCard.findById(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    // update fields
    Object.assign(match, req.body);

    // update images if uploaded
    if (req.files?.imageUrl) {
      match.imageUrl = req.files.imageUrl[0].path;
    }

    if (req.files?.team1Logo) {
      match.team1Logo = req.files.team1Logo[0].path;
    }

    if (req.files?.team2Logo) {
      match.team2Logo = req.files.team2Logo[0].path;
    }

    await match.save();

    res.status(200).json({
      success: true,
      message: "Match updated successfully",
      data: match
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* ===============================
   ❌ DELETE MATCH
================================ */

exports.deleteMatch = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid match id"
      });
    }

    const match = await MatchCard.findByIdAndDelete(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Match deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};