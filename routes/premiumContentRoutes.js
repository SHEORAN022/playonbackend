// const express = require("express");
// const router = express.Router();

// const premiumCtrl = require("../controllers/premiumContentController");
// const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
// const upload = require("../middleware/upload");


// /* ===============================
//    PUBLIC ROUTES
// ================================ */

// // Get all premium content
// router.get("/", premiumCtrl.getAllPremiumContent);

// // Get premium content by category
// router.get("/category/:categoryId", premiumCtrl.getPremiumContentByCategory);

// // Get single premium content
// router.get("/:id", premiumCtrl.getPremiumContentById);



// /* ===============================
//    ADMIN ROUTES
// ================================ */

// // Add premium content
// router.post(
//   "/add",
//   protectAdmin,
//   adminOnly,
//   upload.single("image"),
//   premiumCtrl.addPremiumContent
// );

// // Update premium content
// router.put(
//   "/update/:id",
//   protectAdmin,
//   adminOnly,
//   upload.single("image"),
//   premiumCtrl.updatePremiumContent
// );

// // Delete premium content
// router.delete(
//   "/delete/:id",
//   protectAdmin,
//   adminOnly,
//   premiumCtrl.deletePremiumContent
// );

// module.exports = router;


const express = require("express");
const router = express.Router();

const premiumCtrl = require("../controllers/premiumContentController");
const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

/* ===============================
   PUBLIC ROUTES
================================ */

// Get all premium content
router.get("/", premiumCtrl.getAllPremiumContent);

// Get premium content by category
router.get("/category/:categoryId", premiumCtrl.getPremiumContentByCategory);

// Get single premium content
router.get("/:id", premiumCtrl.getPremiumContentById);


/* ===============================
   ADMIN ROUTES
================================ */

// ✅ Add premium content (IMAGE + VIDEO)
router.post(
  "/add",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  premiumCtrl.addPremiumContent
);

// ✅ Update premium content (IMAGE + VIDEO)
router.put(
  "/update/:id",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  premiumCtrl.updatePremiumContent
);

// Delete premium content
router.delete(
  "/delete/:id",
  protectAdmin,
  adminOnly,
  premiumCtrl.deletePremiumContent
);

module.exports = router;