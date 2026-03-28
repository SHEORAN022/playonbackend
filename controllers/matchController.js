// const MatchCard = require("../models/matchCardModel");
// const mongoose = require("mongoose");


// /* ===============================
//    ➕ ADD MATCH
// ================================ */

// exports.addMatch = async (req, res) => {
//   try {

//     const {
//       tournamentId,
//       title,
//       matchType,
//       videoUrl,
//       league,
//       team1,
//       team2,
//       matchDate,
//       matchTime,
//       venue,
//       isLive
//     } = req.body;

//     // uploaded images from cloudinary
//     const imageUrl = req.files?.imageUrl?.[0]?.path || "";
//     const team1Logo = req.files?.team1Logo?.[0]?.path || "";
//     const team2Logo = req.files?.team2Logo?.[0]?.path || "";

//     // validation
//     if (!tournamentId || !title || !team1 || !team2) {
//       return res.status(400).json({
//         success: false,
//         message: "tournamentId, title, team1, team2 are required"
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid tournamentId"
//       });
//     }

//     const match = await MatchCard.create({
//       tournamentId,
//       title,
//       imageUrl,
//       matchType,
//       videoUrl,
//       league,
//       team1,
//       team2,
//       team1Logo,
//       team2Logo,
//       matchDate,
//       matchTime,
//       venue,
//       isLive
//     });

//     res.status(201).json({
//       success: true,
//       message: "Match created successfully",
//       data: match
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };



// /* ===============================
//    📋 GET ALL MATCHES
// ================================ */

// exports.getAllMatches = async (req, res) => {
//   try {

//     const matches = await MatchCard
//       .find({ tournamentId: { $ne: null } })
//       .populate("tournamentId", "title")
//       .sort({ matchDate: 1 });

//     res.status(200).json({
//       success: true,
//       count: matches.length,
//       data: matches
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };



// /* ===============================
//    📋 GET MATCHES BY TOURNAMENT
// ================================ */

// exports.getMatchesByTournament = async (req, res) => {
//   try {

//     const { tournamentId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid tournamentId"
//       });
//     }

//     const matches = await MatchCard
//       .find({ tournamentId })
//       .sort({ matchDate: 1 });

//     res.status(200).json({
//       success: true,
//       count: matches.length,
//       data: matches
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };



// /* ===============================
//    🔍 GET SINGLE MATCH
// ================================ */

// exports.getSingleMatch = async (req, res) => {
//   try {

//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid match id"
//       });
//     }

//     const match = await MatchCard
//       .findById(id)
//       .populate("tournamentId", "title");

//     if (!match) {
//       return res.status(404).json({
//         success: false,
//         message: "Match not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: match
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };



// /* ===============================
//    ✏ UPDATE MATCH
// ================================ */

// exports.updateMatch = async (req, res) => {
//   try {

//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid match id"
//       });
//     }

//     const match = await MatchCard.findById(id);

//     if (!match) {
//       return res.status(404).json({
//         success: false,
//         message: "Match not found"
//       });
//     }

//     // update fields
//     Object.assign(match, req.body);

//     // update images if uploaded
//     if (req.files?.imageUrl) {
//       match.imageUrl = req.files.imageUrl[0].path;
//     }

//     if (req.files?.team1Logo) {
//       match.team1Logo = req.files.team1Logo[0].path;
//     }

//     if (req.files?.team2Logo) {
//       match.team2Logo = req.files.team2Logo[0].path;
//     }

//     await match.save();

//     res.status(200).json({
//       success: true,
//       message: "Match updated successfully",
//       data: match
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };



// /* ===============================
//    ❌ DELETE MATCH
// ================================ */

// exports.deleteMatch = async (req, res) => {
//   try {

//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid match id"
//       });
//     }

//     const match = await MatchCard.findByIdAndDelete(id);

//     if (!match) {
//       return res.status(404).json({
//         success: false,
//         message: "Match not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Match deleted successfully"
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };



const MatchCard = require("../models/matchCardModel");
const mongoose = require("mongoose");
const uploadToBunny = require("../utils/uploadToBunny");

const controller = {};

/* COMMON UPLOAD */
const uploadFile = async (file, folder) => {
  if (!file) return "";
  return await uploadToBunny(
    file.buffer,
    `${folder}/${Date.now()}-${file.originalname}`
  );
};

/* ADD */
controller.addMatch = async (req, res) => {
  try {
    const { tournamentId, title, team1, team2 } = req.body;

    if (!tournamentId || !title || !team1 || !team2) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const image = await uploadFile(req.files?.image?.[0], "matches/image");
    const team1Logo = await uploadFile(req.files?.team1Logo?.[0], "matches/team1");
    const team2Logo = await uploadFile(req.files?.team2Logo?.[0], "matches/team2");
    const video = await uploadFile(req.files?.video?.[0], "matches/video");

    const match = await MatchCard.create({
      ...req.body,
      imageUrl: image,
      team1Logo,
      team2Logo,
      videoUrl: video
    });

    res.json({ success: true, data: match });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET ALL */
controller.getAllMatches = async (req, res) => {
  try {
    const data = await MatchCard.find().populate("tournamentId", "title");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ✅ FIXED FUNCTION (THIS WAS MISSING) */
controller.getMatchesByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const data = await MatchCard.find({ tournamentId });
    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET SINGLE */
controller.getSingleMatch = async (req, res) => {
  try {
    const data = await MatchCard.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* UPDATE */
controller.updateMatch = async (req, res) => {
  try {
    const match = await MatchCard.findById(req.params.id);
    if (!match) return res.status(404).json({ success: false });

    if (req.files?.image)
      match.imageUrl = await uploadFile(req.files.image[0], "matches/image");

    if (req.files?.team1Logo)
      match.team1Logo = await uploadFile(req.files.team1Logo[0], "matches/team1");

    if (req.files?.team2Logo)
      match.team2Logo = await uploadFile(req.files.team2Logo[0], "matches/team2");

    if (req.files?.video)
      match.videoUrl = await uploadFile(req.files.video[0], "matches/video");

    Object.assign(match, req.body);
    await match.save();

    res.json({ success: true, data: match });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* DELETE */
controller.deleteMatch = async (req, res) => {
  try {
    await MatchCard.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = controller;