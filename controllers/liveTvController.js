

const LiveTV = require("../models/LiveTV");
const Subscription = require("../models/Subscription");
const uploadToBunny = require("../utils/uploadToBunny");


/* =====================================================
   ADMIN: ADD LIVE TV
===================================================== */

exports.addLiveTV = async (req, res) => {
  try {

    const {
      name,
      streamUrl,
      category,
      language,
      country,
      isPremium,
      order,
      description,
      logo: logoUrl
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Channel name required"
      });
    }

    let logo = "";
    let finalStream = "";
    let streamType = "url";

    /* ================= LOGO ================= */

    if (req.files?.logo?.[0]) {

      const file = req.files.logo[0];
      const fileName = `livetv/logo-${Date.now()}-${file.originalname}`;

      logo = await uploadToBunny(file.buffer, fileName);

    } else if (logoUrl) {

      logo = logoUrl;

    } else {

      return res.status(400).json({
        success: false,
        message: "Logo required"
      });

    }


    /* ================= VIDEO UPLOAD ================= */

    if (req.files?.video?.[0]) {

      const file = req.files.video[0];
      const fileName = `livetv/video-${Date.now()}-${file.originalname}`;

      finalStream = await uploadToBunny(file.buffer, fileName);
      streamType = "video";

    }

    /* ================= STREAM URL ================= */

    else if (streamUrl) {

      finalStream = streamUrl;
      streamType = "url";

    }


    const tv = await LiveTV.create({
      name,
      logo,
      streamUrl: finalStream,
      streamType,
      category,
      language,
      country,
      isPremium,
      order,
      description
    });

    res.status(201).json({
      success: true,
      message: "Live TV added successfully",
      data: tv
    });

  } catch (error) {

    console.log("Add LiveTV Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* =====================================================
   ADMIN: UPDATE LIVE TV
===================================================== */

exports.updateLiveTV = async (req, res) => {
  try {

    const tv = await LiveTV.findById(req.params.id);

    if (!tv) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    const {
      name,
      streamUrl,
      category,
      language,
      country,
      status,
      isPremium,
      order,
      description,
      logo: logoUrl
    } = req.body;


    /* ================= LOGO ================= */

    if (req.files?.logo?.[0]) {

      const file = req.files.logo[0];
      const fileName = `livetv/logo-${Date.now()}-${file.originalname}`;

      tv.logo = await uploadToBunny(file.buffer, fileName);

    } else if (logoUrl) {

      tv.logo = logoUrl;

    }


    /* ================= VIDEO ================= */

    if (req.files?.video?.[0]) {

      const file = req.files.video[0];
      const fileName = `livetv/video-${Date.now()}-${file.originalname}`;

      tv.streamUrl = await uploadToBunny(file.buffer, fileName);
      tv.streamType = "video";

    }

    /* ================= STREAM URL ================= */

    else if (streamUrl) {

      tv.streamUrl = streamUrl;
      tv.streamType = "url";

    }


    /* ================= OTHER FIELDS ================= */

    if (name) tv.name = name;
    if (category) tv.category = category;
    if (language) tv.language = language;
    if (country) tv.country = country;
    if (status) tv.status = status;

    if (isPremium !== undefined) {
      tv.isPremium = isPremium;
    }

    if (order !== undefined) {
      tv.order = order;
    }

    if (description) {
      tv.description = description;
    }

    await tv.save();

    res.json({
      success: true,
      message: "Live TV updated successfully",
      data: tv
    });

  } catch (error) {

    console.log("Update LiveTV Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* =====================================================
   ADMIN: DELETE LIVE TV
===================================================== */

exports.deleteLiveTV = async (req, res) => {
  try {

    const tv = await LiveTV.findById(req.params.id);

    if (!tv) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    await tv.deleteOne();

    res.json({
      success: true,
      message: "Channel deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* =====================================================
   ADMIN: TOGGLE STATUS
===================================================== */

exports.toggleLiveTV = async (req, res) => {
  try {

    const tv = await LiveTV.findById(req.params.id);

    if (!tv) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    tv.status = tv.status === "active" ? "inactive" : "active";

    await tv.save();

    res.json({
      success: true,
      message: "Status updated",
      data: tv
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* =====================================================
   USER: GET ALL LIVE TV
===================================================== */

exports.getAllLiveTV = async (req, res) => {
  try {

    const tv = await LiveTV
      .find({})
  
      .sort({ isPremium: 1, order: 1, createdAt: -1 });

    res.json({
      success: true,
      total: tv.length,
      data: tv
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* =====================================================
   USER: GET BY CATEGORY
===================================================== */

exports.getByCategory = async (req, res) => {
  try {

    const tv = await LiveTV.find({
      category: req.params.category,
      status: "active"
    });

    res.json({
      success: true,
      total: tv.length,
      data: tv
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



/* =====================================================
   USER: GET SINGLE CHANNEL
===================================================== */

exports.getSingleTV = async (req, res) => {
  try {

    const tv = await LiveTV.findById(req.params.id);

    if (!tv) {
      return res.status(404).json({
        message: "Channel not found"
      });
    }

    if (!tv.isPremium) {

      return res.json({
        success: true,
        locked: false,
        data: tv
      });

    }

    const sub = await Subscription.findOne({
      user: req.user?.id,
      status: "active",
      expireAt: { $gt: new Date() }
    });

    if (!sub) {

      return res.json({
        success: true,
        locked: true,
        message: "Subscription required"
      });

    }

    res.json({
      success: true,
      locked: false,
      data: tv
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



/* =====================================================
   VIEWER COUNT
===================================================== */

exports.increaseViewer = async (req, res) => {
  try {

    await LiveTV.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewers: 1 } }
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
