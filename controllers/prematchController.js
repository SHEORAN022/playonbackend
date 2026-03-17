// const Prematch = require("../models/Prematch");

// /* ================= CREATE PREMATCH ================= */
// exports.createPrematch = async (req, res) => {
//   try {

//     let imageUrl = req.body.imageUrl || "";
//     let team1Logo = req.body.team1Logo || "";
//     let team2Logo = req.body.team2Logo || "";

//     if (req.files?.image) {
//       imageUrl = req.files.image[0].path;
//     }

//     if (req.files?.team1Logo) {
//       team1Logo = req.files.team1Logo[0].path;
//     }

//     if (req.files?.team2Logo) {
//       team2Logo = req.files.team2Logo[0].path;
//     }

//     const match = await Prematch.create({
//       title: req.body.title,
//       category: req.body.category,
//       league: req.body.league,
//       videoUrl: req.body.videoUrl,
//       matchType: req.body.matchType,
//       team1: req.body.team1,
//       team2: req.body.team2,
//       isLive: req.body.isLive || false,
//       viewers: req.body.viewers || 0,
//       matchDate: req.body.matchDate,
//       stadium: req.body.stadium,
//       country: req.body.country,
//       analysis: req.body.analysis,
//       imageUrl,
//       team1Logo,
//       team2Logo
//     });

//     res.status(201).json({
//       success: true,
//       message: "Prematch created successfully",
//       data: match
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };


// /* ================= GET ALL MATCH ================= */
// exports.getAllPrematch = async (req, res) => {
//   try {

//     const filter = {};

//     if (req.query.category) {
//       filter.category = req.query.category;
//     }

//     if (req.query.matchType) {
//       filter.matchType = req.query.matchType;
//     }

//     const matches = await Prematch
//       .find(filter)
//       .populate("category", "title icon")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       total: matches.length,
//       data: matches
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };


// /* ================= GET SINGLE MATCH ================= */
// exports.getSinglePrematch = async (req, res) => {
//   try {

//     const match = await Prematch
//       .findById(req.params.id)
//       .populate("category", "title icon");

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


// /* ================= UPDATE PREMATCH ================= */
// exports.updatePrematch = async (req, res) => {
//   try {

//     const match = await Prematch.findById(req.params.id);

//     if (!match) {
//       return res.status(404).json({
//         success: false,
//         message: "Match not found"
//       });
//     }

//     if (req.files?.image) {
//       match.imageUrl = req.files.image[0].path;
//     }

//     if (req.files?.team1Logo) {
//       match.team1Logo = req.files.team1Logo[0].path;
//     }

//     if (req.files?.team2Logo) {
//       match.team2Logo = req.files.team2Logo[0].path;
//     }

//     match.title = req.body.title || match.title;
//     match.category = req.body.category || match.category;
//     match.league = req.body.league || match.league;
//     match.videoUrl = req.body.videoUrl || match.videoUrl;
//     match.matchType = req.body.matchType || match.matchType;
//     match.team1 = req.body.team1 || match.team1;
//     match.team2 = req.body.team2 || match.team2;
//     match.isLive = req.body.isLive ?? match.isLive;
//     match.viewers = req.body.viewers ?? match.viewers;
//     match.matchDate = req.body.matchDate || match.matchDate;
//     match.stadium = req.body.stadium || match.stadium;
//     match.country = req.body.country || match.country;
//     match.analysis = req.body.analysis || match.analysis;

//     await match.save();

//     res.status(200).json({
//       success: true,
//       message: "Prematch updated successfully",
//       data: match
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };


// /* ================= DELETE PREMATCH ================= */
// exports.deletePrematch = async (req, res) => {
//   try {

//     const match = await Prematch.findById(req.params.id);

//     if (!match) {
//       return res.status(404).json({
//         success: false,
//         message: "Match not found"
//       });
//     }

//     await match.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Prematch deleted successfully"
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };


// /* ================= TOGGLE LIVE ================= */
// exports.toggleLive = async (req, res) => {
//   try {

//     const match = await Prematch.findById(req.params.id);

//     if (!match) {
//       return res.status(404).json({
//         success: false,
//         message: "Match not found"
//       });
//     }

//     match.isLive = !match.isLive;
//     match.matchType = match.isLive ? "LIVE" : "UPCOMING";

//     await match.save();

//     res.status(200).json({
//       success: true,
//       message: "Live status updated",
//       data: match
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };
// /* ================= GET MATCHES BY CATEGORY ================= */
// exports.getMatchesByCategory = async (req, res) => {
//   try {

//     const matches = await Prematch
//       .find({ category: req.params.categoryId })
//       .populate("category", "title icon")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       total: matches.length,
//       data: matches
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }
// };




const Prematch = require("../models/Prematch");
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

    // TEAM 1 LOGO
    if (req.files?.team1Logo?.[0]) {
      const file = req.files.team1Logo[0];
      team1Logo = await uploadToBunny(
        file.buffer,
        `prematch/team1/${Date.now()}-${file.originalname}`
      );
    }

    // TEAM 2 LOGO
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
      isLive: req.body.isLive || false,
      viewers: req.body.viewers || 0,
      matchDate: req.body.matchDate,
      stadium: req.body.stadium,
      country: req.body.country,
      analysis: req.body.analysis,

      imageUrl,
      team1Logo,
      team2Logo,
      videoUrl
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


/* ================= GET ALL ================= */
exports.getAllPrematch = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.matchType) filter.matchType = req.query.matchType;

    const matches = await Prematch
      .find(filter)
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: matches.length,
      data: matches
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= GET SINGLE ================= */
exports.getSinglePrematch = async (req, res) => {
  try {
    const match = await Prematch
      .findById(req.params.id)
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
    res.status(500).json({ success: false, message: error.message });
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

    // TEAM LOGOS
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

    // TEXT FIELDS UPDATE
    match.title = req.body.title || match.title;
    match.category = req.body.category || match.category;
    match.league = req.body.league || match.league;
    match.matchType = req.body.matchType || match.matchType;
    match.team1 = req.body.team1 || match.team1;
    match.team2 = req.body.team2 || match.team2;
    match.isLive = req.body.isLive ?? match.isLive;
    match.viewers = req.body.viewers ?? match.viewers;
    match.matchDate = req.body.matchDate || match.matchDate;
    match.stadium = req.body.stadium || match.stadium;
    match.country = req.body.country || match.country;
    match.analysis = req.body.analysis || match.analysis;

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
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= CATEGORY FILTER ================= */
exports.getMatchesByCategory = async (req, res) => {
  try {
    const matches = await Prematch
      .find({ category: req.params.categoryId })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: matches.length,
      data: matches
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};