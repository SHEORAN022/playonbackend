const MatchCard = require("../models/matchCardModel");
const mongoose = require("mongoose");
const uploadToBunny = require("../utils/uploadToBunny");

const controller = {};

/* ================= COMMON UPLOAD ================= */
const uploadFile = async (file, folder) => {
  if (!file) return "";
  return await uploadToBunny(
    file.buffer,
    `${folder}/${Date.now()}-${file.originalname}`
  );
};

/* ================= STATUS FUNCTION ================= */
const getMatchStatus = (matchDate, matchTime) => {
  const now = new Date();

  const matchDateTime = new Date(matchDate);

  if (matchTime) {
    const [h, m] = matchTime.split(":");
    matchDateTime.setHours(h, m, 0, 0);
  }

  return now >= matchDateTime ? "LIVE" : "UPCOMING";
};

/* ================= ADD MATCH ================= */
controller.addMatch = async (req, res) => {
  try {
    const {
      tournamentId,
      title,
      team1,
      team2,
      matchDate,
      matchTime
    } = req.body;

    if (!tournamentId || !title || !team1 || !team2 || !matchDate) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const image = await uploadFile(req.files?.image?.[0], "matches/image");
    const team1Logo = await uploadFile(req.files?.team1Logo?.[0], "matches/team1");
    const team2Logo = await uploadFile(req.files?.team2Logo?.[0], "matches/team2");
    const video = await uploadFile(req.files?.video?.[0], "matches/video");

    // 🔥 STATUS AUTO
    const status = getMatchStatus(matchDate, matchTime);

    const match = await MatchCard.create({
      ...req.body,
      imageUrl: image,
      team1Logo,
      team2Logo,
      videoUrl: video,
      matchType: status
    });

    res.json({ success: true, data: match });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL ================= */
controller.getAllMatches = async (req, res) => {
  try {
    const data = await MatchCard.find().populate("tournamentId", "title");

    const updated = data.map(match => {
      const status = getMatchStatus(match.matchDate, match.matchTime);

      return {
        ...match.toObject(),
        matchType: status // 🔥 realtime status
      };
    });

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET BY TOURNAMENT ================= */
controller.getMatchesByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const data = await MatchCard.find({ tournamentId });

    const updated = data.map(match => {
      const status = getMatchStatus(match.matchDate, match.matchTime);
      return { ...match.toObject(), matchType: status };
    });

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET SINGLE ================= */
controller.getSingleMatch = async (req, res) => {
  try {
    const match = await MatchCard.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const status = getMatchStatus(match.matchDate, match.matchTime);

    res.json({
      success: true,
      data: {
        ...match.toObject(),
        matchType: status
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
controller.updateMatch = async (req, res) => {
  try {
    const match = await MatchCard.findById(req.params.id);
    if (!match) return res.status(404).json({ success: false });

    // FILES
    if (req.files?.image)
      match.imageUrl = await uploadFile(req.files.image[0], "matches/image");

    if (req.files?.team1Logo)
      match.team1Logo = await uploadFile(req.files.team1Logo[0], "matches/team1");

    if (req.files?.team2Logo)
      match.team2Logo = await uploadFile(req.files.team2Logo[0], "matches/team2");

    if (req.files?.video)
      match.videoUrl = await uploadFile(req.files.video[0], "matches/video");

    // BODY UPDATE
    Object.assign(match, req.body);

    // 🔥 STATUS AUTO (VERY IMPORTANT)
    const status = getMatchStatus(match.matchDate, match.matchTime);
    match.matchType = status;

    await match.save();

    res.json({ success: true, data: match });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
controller.deleteMatch = async (req, res) => {
  try {
    await MatchCard.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = controller;
