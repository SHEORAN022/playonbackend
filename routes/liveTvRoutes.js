



// const express = require("express");
// const router = express.Router();
// const tv = require("../controllers/liveTvController");
// const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
// const upload = require("../middleware/upload");
// const { protectUser } = require("../middleware/auth");  

// /* ===== ADMIN ===== */

// router.post(
//   "/admin/add",
//   protectAdmin,
//   adminOnly,
//   upload.fields([
//     { name: "logo", maxCount: 1 },
//     { name: "video", maxCount: 1 }
//   ]),
//   tv.addLiveTV
// );

// router.put(
//   "/admin/update/:id",
//   protectAdmin,
//   adminOnly,
//   upload.fields([
//     { name: "logo", maxCount: 1 },
//     { name: "video", maxCount: 1 }
//   ]),
//   tv.updateLiveTV
// );

// router.delete("/admin/delete/:id", protectAdmin, adminOnly, tv.deleteLiveTV);
// router.patch("/admin/toggle/:id", protectAdmin, adminOnly, tv.toggleLiveTV);

// /* ===== USER ===== */

// router.get("/all", protectUser, tv.getAllLiveTV);
// router.get("/category/:category", tv.getByCategory);
// router.patch("/viewer/:id", tv.increaseViewer);
// router.get("/:id", protectUser, tv.getSingleTV);

// module.exports = router;


const express = require("express");
const router = express.Router();
const tv = require("../controllers/liveTvController");

const { protectAdmin, adminOnly } = require("../middleware/authMiddleware");
const { protectUser } = require("../middleware/auth");
const upload = require("../middleware/upload");

/* ===== COMMON AUTH (ADMIN + USER) ===== */
const protectAny = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const Admin = require("../models/Admin");
    const User = require("../models/User");

    // पहले admin check
    const admin = await Admin.findById(decoded.id);
    if (admin) {
      req.admin = admin;
      return next();
    }

    // फिर user check
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
      return next();
    }

    return res.status(401).json({ message: "Invalid token" });

  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};

/* ===== ADMIN ===== */

router.post(
  "/admin/add",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  tv.addLiveTV
);

router.put(
  "/admin/update/:id",
  protectAdmin,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  tv.updateLiveTV
);

router.delete("/admin/delete/:id", protectAdmin, adminOnly, tv.deleteLiveTV);
router.patch("/admin/toggle/:id", protectAdmin, adminOnly, tv.toggleLiveTV);

/* ===== USER + ADMIN BOTH ===== */

router.get("/all", protectAny, tv.getAllLiveTV);

/* ===== USER ONLY ===== */

router.get("/category/:category", tv.getByCategory);
router.patch("/viewer/:id", tv.increaseViewer);
router.get("/:id", protectUser, tv.getSingleTV);

module.exports = router;
