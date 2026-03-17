const Schedule = require("../models/scheduleModel");
const uploadToBunny = require("../utils/uploadToBunny");

/* ================= HELPER ================= */

async function parseSections(body, files = []) {
  let sections = [];

  if (body.sections) {
    try {
      sections =
        typeof body.sections === "string"
          ? JSON.parse(body.sections)
          : body.sections;
    } catch (err) {
      throw new Error("Invalid sections JSON");
    }
  }

  for (const file of files) {
    const parts = file.fieldname.split("_");
    if (parts.length !== 3) continue;

    const field = parts[0];
    const sIdx = parseInt(parts[1].replace("s", ""));
    const mIdx = parseInt(parts[2].replace("m", ""));

    if (!sections[sIdx]?.matches?.[mIdx]) continue;

    const imageUrl = await uploadToBunny(
      file.buffer,
      `matches/${Date.now()}-${file.originalname}`
    );

    if (field === "team1Logo") {
      sections[sIdx].matches[mIdx].team1Logo = imageUrl;
    }

    if (field === "team2Logo") {
      sections[sIdx].matches[mIdx].team2Logo = imageUrl;
    }

    if (field === "matchBanner") {
      sections[sIdx].matches[mIdx].matchBanner = imageUrl;
    }
  }

  return sections;
}

/* ================= ADD ================= */

exports.addSchedule = async (req, res) => {
  try {
    const { category, leagueName } = req.body;

    if (!category || !leagueName) {
      return res.status(400).json({
        success: false,
        message: "category and leagueName required"
      });
    }

    const files = req.files || [];

    let leagueLogo = req.body.leagueLogo || "";
    let leagueBanner = req.body.leagueBanner || "";

    for (const file of files) {
      if (file.fieldname === "leagueLogo") {
        leagueLogo = await uploadToBunny(
          file.buffer,
          `league/${Date.now()}-${file.originalname}`
        );
      }

      if (file.fieldname === "leagueBanner") {
        leagueBanner = await uploadToBunny(
          file.buffer,
          `league/${Date.now()}-${file.originalname}`
        );
      }
    }

    const sections = await parseSections(req.body, files);

    const schedule = await Schedule.create({
      category,
      leagueName,
      leagueLogo,
      leagueBanner,
      sections
    });

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET ALL ================= */

exports.getSchedule = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const schedules = await Schedule.find(filter)
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: schedules.length,
      data: schedules
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET BY CATEGORY ================= */

exports.getScheduleByCategory = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      category: req.params.categoryId
    })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: schedules.length,
      data: schedules
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET SINGLE ================= */

exports.getSingleSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("category", "title icon");

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    res.json({
      success: true,
      data: schedule
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= UPDATE ================= */

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    const files = req.files || [];

    if (req.body.category) schedule.category = req.body.category;
    if (req.body.leagueName) schedule.leagueName = req.body.leagueName;

    // URL support
    if (req.body.leagueLogo) schedule.leagueLogo = req.body.leagueLogo;
    if (req.body.leagueBanner) schedule.leagueBanner = req.body.leagueBanner;

    for (const file of files) {
      if (file.fieldname === "leagueLogo") {
        schedule.leagueLogo = await uploadToBunny(
          file.buffer,
          `league/${Date.now()}-${file.originalname}`
        );
      }

      if (file.fieldname === "leagueBanner") {
        schedule.leagueBanner = await uploadToBunny(
          file.buffer,
          `league/${Date.now()}-${file.originalname}`
        );
      }
    }

    if (req.body.sections) {
      schedule.sections = await parseSections(req.body, files);
    }

    await schedule.save();

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= DELETE ================= */

exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    res.json({
      success: true,
      message: "Schedule deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};