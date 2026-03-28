




// const MatchHighlight = require("../models/MatchHighlight");


// /* =========================================================
//    ADD HIGHLIGHT (ADMIN)
// ========================================================= */
// exports.addHighlight = async (req, res) => {
//   try {

//     const {
//       categoryId,
//       league,
//       team1,
//       team2,
//       team1Logo,
//       team2Logo,
//       bannerImage,
//       videoUrl,
//       isLive,
//       viewers,
//       matchId,
//       matchTime,
//     } = req.body;

//     if (
//       !categoryId ||
//       !league ||
//       !team1 ||
//       !team2 ||
//       !team1Logo ||
//       !team2Logo ||
//       !bannerImage ||
//       !matchTime
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields missing",
//       });
//     }

//     const highlight = await MatchHighlight.create({
//       categoryId,
//       league,
//       team1,
//       team2,
//       team1Logo,
//       team2Logo,
//       bannerImage,
//       videoUrl,
//       isLive,
//       viewers,
//       matchId,
//       matchTime,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Highlight added successfully",
//       data: highlight,
//     });

//   } catch (err) {
//     console.log("Add highlight error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// /* =========================================================
//    GET ALL HIGHLIGHTS
// ========================================================= */
// exports.getAllHighlights = async (req, res) => {
//   try {

//     const highlights = await MatchHighlight
//       .find()
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: highlights.length,
//       data: highlights,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// /* =========================================================
//    GET HIGHLIGHTS BY CATEGORY  ⭐ (MAIN API)
// ========================================================= */
// exports.getHighlightsByCategory = async (req, res) => {
//   try {

//     const { categoryId } = req.params;

//     const highlights = await MatchHighlight
//       .find({ categoryId })
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: highlights.length,
//       data: highlights,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// /* =========================================================
//    GET SINGLE HIGHLIGHT
// ========================================================= */
// exports.getSingleHighlight = async (req, res) => {
//   try {

//     const highlight = await MatchHighlight.findById(req.params.id);

//     if (!highlight) {
//       return res.status(404).json({
//         success: false,
//         message: "Highlight not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: highlight,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// /* =========================================================
//    UPDATE HIGHLIGHT (ADMIN)
// ========================================================= */
// exports.updateHighlight = async (req, res) => {
//   try {

//     const highlight = await MatchHighlight.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!highlight) {
//       return res.status(404).json({
//         success: false,
//         message: "Highlight not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Highlight updated successfully",
//       data: highlight,
//     });

//   } catch (err) {
//     console.log("Update error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// /* =========================================================
//    DELETE HIGHLIGHT (ADMIN)
// ========================================================= */
// exports.deleteHighlight = async (req, res) => {
//   try {

//     const highlight = await MatchHighlight.findByIdAndDelete(req.params.id);

//     if (!highlight) {
//       return res.status(404).json({
//         success: false,
//         message: "Highlight not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Highlight deleted successfully",
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// /* =========================================================
//    TOGGLE LIVE (ADMIN)
// ========================================================= */
// exports.toggleLive = async (req, res) => {
//   try {

//     const highlight = await MatchHighlight.findById(req.params.id);

//     if (!highlight) {
//       return res.status(404).json({
//         success: false,
//         message: "Highlight not found",
//       });
//     }

//     highlight.isLive = !highlight.isLive;
//     await highlight.save();

//     res.json({
//       success: true,
//       message: "Live status updated",
//       data: highlight,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// /* =========================================================
//    ADD VIEWER (FLUTTER)
// ========================================================= */
// exports.addViewer = async (req, res) => {
//   try {

//     const highlight = await MatchHighlight.findById(req.params.id);

//     if (!highlight) {
//       return res.status(404).json({
//         success: false,
//         message: "Highlight not found",
//       });
//     }

//     highlight.viewers = (highlight.viewers || 0) + 1;
//     await highlight.save();

//     res.json({
//       success: true,
//       viewers: highlight.viewers,
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };





const MatchHighlight = require("../models/MatchHighlight");
const uploadToBunny = require("../utils/uploadToBunny");

/* =========================================================
   ADD HIGHLIGHT (IMAGE + VIDEO UPLOAD)
========================================================= */
exports.addHighlight = async (req, res) => {
  try {

    const {
      categoryId,
      league,
      team1,
      team2,
      matchTime,
      isLive,
      viewers,
      matchId
    } = req.body;

    if (!categoryId || !league || !team1 || !team2 || !matchTime) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const files = req.files;

    if (!files?.team1Logo || !files?.team2Logo || !files?.bannerImage) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    // 🔥 TEAM 1 LOGO
    const team1File = files.team1Logo[0];
    const team1Logo = await uploadToBunny(
      team1File.buffer,
      `highlights/team1-${Date.now()}-${team1File.originalname}`
    );

    // 🔥 TEAM 2 LOGO
    const team2File = files.team2Logo[0];
    const team2Logo = await uploadToBunny(
      team2File.buffer,
      `highlights/team2-${Date.now()}-${team2File.originalname}`
    );

    // 🔥 BANNER
    const bannerFile = files.bannerImage[0];
    const bannerImage = await uploadToBunny(
      bannerFile.buffer,
      `highlights/banner-${Date.now()}-${bannerFile.originalname}`
    );

    // 🔥 VIDEO (OPTIONAL)
    let videoUrl = "";
    if (files?.video) {
      const videoFile = files.video[0];
      videoUrl = await uploadToBunny(
        videoFile.buffer,
        `highlights/video-${Date.now()}-${videoFile.originalname}`
      );
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
   UPDATE HIGHLIGHT (SAFE UPDATE + FILE OPTIONAL)
========================================================= */
exports.updateHighlight = async (req, res) => {
  try {

    const { id } = req.params;
    const files = req.files;

    const existing = await MatchHighlight.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    let updateData = { ...req.body };

    // 🔥 TEAM 1 LOGO
    if (files?.team1Logo) {
      const file = files.team1Logo[0];
      updateData.team1Logo = await uploadToBunny(
        file.buffer,
        `highlights/team1-${Date.now()}-${file.originalname}`
      );
    } else {
      updateData.team1Logo = existing.team1Logo;
    }

    // 🔥 TEAM 2 LOGO
    if (files?.team2Logo) {
      const file = files.team2Logo[0];
      updateData.team2Logo = await uploadToBunny(
        file.buffer,
        `highlights/team2-${Date.now()}-${file.originalname}`
      );
    } else {
      updateData.team2Logo = existing.team2Logo;
    }

    // 🔥 BANNER
    if (files?.bannerImage) {
      const file = files.bannerImage[0];
      updateData.bannerImage = await uploadToBunny(
        file.buffer,
        `highlights/banner-${Date.now()}-${file.originalname}`
      );
    } else {
      updateData.bannerImage = existing.bannerImage;
    }

    // 🔥 VIDEO
    if (files?.video) {
      const file = files.video[0];
      updateData.videoUrl = await uploadToBunny(
        file.buffer,
        `highlights/video-${Date.now()}-${file.originalname}`
      );
    } else {
      updateData.videoUrl = existing.videoUrl;
    }

    const updated = await MatchHighlight.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Highlight updated successfully",
      data: updated,
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
   DELETE
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
   GET ALL
========================================================= */
exports.getAllHighlights = async (req, res) => {
  try {

    const data = await MatchHighlight.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   GET BY CATEGORY
========================================================= */
exports.getHighlightsByCategory = async (req, res) => {
  try {

    const data = await MatchHighlight
      .find({ categoryId: req.params.categoryId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   GET SINGLE
========================================================= */
exports.getSingleHighlight = async (req, res) => {
  try {

    const data = await MatchHighlight.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   TOGGLE LIVE
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
   ADD VIEWER
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