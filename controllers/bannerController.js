// const Banner = require("../models/Banner");
// const uploadToBunny = require("../utils/uploadToBunny");

// /* ================= ADD BANNER ================= */

// // exports.addBanner = async (req, res) => {
// //   try {
// //     let imageUrls = [];

// //     // CASE 1: File upload via multer
// //     if (req.files && req.files.length > 0) {
// //       imageUrls = req.files.map(file => file.path);
// //     }
// //     // CASE 2: Direct URL from body (handle both JSON and form-data)
// //     else if (req.body && req.body.images) {
// //       // Handle if images is a string (single URL)
// //       if (typeof req.body.images === 'string') {
// //         imageUrls = [req.body.images];
// //       }
// //       // Handle if images is an array
// //       else if (Array.isArray(req.body.images)) {
// //         imageUrls = req.body.images;
// //       }
// //     }

// //     if (imageUrls.length === 0) {
// //       return res.status(400).json({ 
// //         message: "Images required",
// //         received: req.body // Debug: see what was received
// //       });
// //     }

// //     if (imageUrls.length > 3) {
// //       return res.status(400).json({ message: "Max 3 images allowed" });
// //     }

// //     const banner = new Banner({
// //       images: imageUrls,
// //       title: req.body.title || null,
// //       description: req.body.description || null,
// //       is_active: req.body.is_active ?? true,
// //       sort_order: parseInt(req.body.sort_order) || 0 // Parse to number
// //     });

// //     await banner.save();

// //     res.status(201).json({
// //       success: true,
// //       message: "Banner created",
// //       data: banner
// //     });

// //   } catch (err) {
// //     console.error("Banner creation error:", err);
// //     res.status(500).json({ 
// //       message: err.message,
// //       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
// //     });
// //   }
// // };

// // exports.addBanner = async (req, res) => {
// //   try {

// //     if (!req.files || req.files.length === 0) {
// //       return res.status(400).json({ message: "Image required" });
// //     }

// //     const imageUrls = [];

// //     for (const file of req.files) {
// //       const fileName = Date.now() + "-" + file.originalname;

// //       const url = await uploadToBunny(file.buffer, fileName);

// //       imageUrls.push(url);
// //     }

// //     const banner = await Banner.create({
// //       title: req.body.title,
// //       description: req.body.description,
// //       images: imageUrls,
// //       is_active: req.body.is_active,
// //       sort_order: req.body.sort_order
// //     });

// //     res.json({
// //       success: true,
// //       data: banner
// //     });

// //   } catch (error) {
// //     console.error("Banner creation error:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // };
// exports.addBanner = async (req, res) => {
//   try {

//     if (!req.file) {
//       return res.status(400).json({ message: "Image required" });
//     }

//     const fileName = `banners/${Date.now()}-${req.file.originalname}`;

//     const imageUrl = await uploadToBunny(req.file.buffer, fileName);

//     const banner = await Banner.create({
//       title: req.body.title,
//       description: req.body.description,
//       image: imageUrl,
//       is_active: req.body.is_active,
//       sort_order: req.body.sort_order
//     });

//     res.json({
//       success: true,
//       data: banner
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };
// /* ================= GET ALL ================= */
// exports.getBanners = async (req, res) => {
//   try {

//     const banners = await Banner.find().sort({ sort_order: 1 });

//     res.json({
//       success: true,
//       total: banners.length,
//       data: banners
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ================= GET SINGLE ================= */
// exports.getSingleBanner = async (req, res) => {
//   try {

//     const banner = await Banner.findById(req.params.id);

//     if (!banner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }

//     res.json({
//       success: true,
//       data: banner
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ================= UPDATE ================= */
// // exports.updateBanner = async (req, res) => {
// //   try {

// //     const updateData = {
// //       title: req.body.title,
// //       description: req.body.description,
// //       is_active: req.body.is_active,
// //       sort_order: req.body.sort_order,
// //       updated_at: Date.now()
// //     };

// //     // agar new images upload hui
// //     if (req.files && req.files.length > 0) {

// //       if (req.files.length > 3) {
// //         return res.status(400).json({ message: "Max 3 images allowed" });
// //       }

// //       updateData.images = req.files.map(file => file.path);
// //     }

// //     const banner = await Banner.findByIdAndUpdate(
// //       req.params.id,
// //       updateData,
// //       { new: true }
// //     );

// //     if (!banner) {
// //       return res.status(404).json({ message: "Banner not found" });
// //     }

// //     res.json({
// //       success: true,
// //       message: "Banner updated",
// //       data: banner
// //     });

// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// exports.updateBanner = async (req, res) => {
//   try {

//     const updateData = {
//       title: req.body.title,
//       description: req.body.description,
//       is_active: req.body.is_active,
//       sort_order: req.body.sort_order,
//       updated_at: Date.now()
//     };

//     if (req.file) {

//       const fileName = `banners/${Date.now()}-${req.file.originalname}`;

//       const imageUrl = await uploadToBunny(req.file.buffer, fileName);

//       updateData.image = imageUrl;
//     }

//     const banner = await Banner.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: banner
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// /* ================= DELETE ================= */
// exports.deleteBanner = async (req, res) => {
//   try {

//     const banner = await Banner.findById(req.params.id);

//     if (!banner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }

//     await Banner.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: "Banner deleted"
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ================= TOGGLE ================= */
// exports.toggleBanner = async (req, res) => {
//   try {

//     const banner = await Banner.findById(req.params.id);

//     if (!banner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }

//     banner.is_active = !banner.is_active;
//     await banner.save();

//     res.json({
//       success: true,
//       message: "Status updated",
//       data: banner
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };








const Banner = require("../models/Banner");
const uploadToBunny = require("../utils/uploadToBunny");

/* ================= ADD BANNER ================= */

exports.addBanner = async (req, res) => {
  try {

    let imageUrl = null;

    // CASE 1: File Upload
    if (req.file) {

      const fileName = `banners/${Date.now()}-${Math.round(Math.random()*1E9)}-${req.file.originalname}`;

      imageUrl = await uploadToBunny(req.file.buffer, fileName);
    }

    // CASE 2: Direct URL
    else if (req.body.image) {
      imageUrl = req.body.image;
    }

    else {
      return res.status(400).json({ message: "Image required" });
    }

    const banner = await Banner.create({
      image: imageUrl,
      title: req.body.title || null,
      description: req.body.description || null,
      is_active: req.body.is_active ?? true,
      sort_order: req.body.sort_order || 0
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner
    });

  } catch (error) {
    console.error("Add Banner Error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET ALL ================= */

exports.getBanners = async (req, res) => {
  try {

    const banners = await Banner.find().sort({ sort_order: 1 });

    res.json({
      success: true,
      total: banners.length,
      data: banners
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET SINGLE ================= */

exports.getSingleBanner = async (req, res) => {
  try {

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({
      success: true,
      data: banner
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE BANNER ================= */

exports.updateBanner = async (req, res) => {
  try {

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      is_active: req.body.is_active,
      sort_order: req.body.sort_order,
      updated_at: Date.now()
    };

    // File upload
    if (req.file) {

      const fileName = `banners/${Date.now()}-${Math.round(Math.random()*1E9)}-${req.file.originalname}`;

      const imageUrl = await uploadToBunny(req.file.buffer, fileName);

      updateData.image = imageUrl;
    }

    // Direct URL
    else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({
      success: true,
      message: "Banner updated successfully",
      data: banner
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= DELETE ================= */

exports.deleteBanner = async (req, res) => {
  try {

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Banner deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= TOGGLE STATUS ================= */

exports.toggleBanner = async (req, res) => {
  try {

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.is_active = !banner.is_active;
    banner.updated_at = Date.now();

    await banner.save();

    res.json({
      success: true,
      message: "Banner status updated",
      data: banner
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};