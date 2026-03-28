



// const Schedule = require("../models/scheduleModel");
// const Subscription = require("../models/Subscription");
// const uploadToBunny = require("../utils/uploadToBunny");

// /* ================= HELPER ================= */

// async function parseSections(body, files = []) {
//   let sections = [];

//   if (body.sections) {
//     sections =
//       typeof body.sections === "string"
//         ? JSON.parse(body.sections)
//         : body.sections;
//   }

//   for (const file of files) {
//     const parts = file.fieldname.split("_");
//     if (parts.length !== 3) continue;

//     const field = parts[0];
//     const sIdx = parseInt(parts[1].replace("s", ""));
//     const mIdx = parseInt(parts[2].replace("m", ""));

//     if (!sections[sIdx]?.matches?.[mIdx]) continue;

//     const fileUrl = await uploadToBunny(
//       file.buffer,
//       `matches/${field}/${Date.now()}-${file.originalname}`
//     );

//     if (field === "team1Logo") sections[sIdx].matches[mIdx].team1Logo = fileUrl;
//     if (field === "team2Logo") sections[sIdx].matches[mIdx].team2Logo = fileUrl;
//     if (field === "matchBanner") sections[sIdx].matches[mIdx].matchBanner = fileUrl;
//     if (field === "video") sections[sIdx].matches[mIdx].liveUrl = fileUrl;
//   }

//   return sections;
// }


// /* ================= ADD ================= */

// exports.addSchedule = async (req, res) => {
//   try {
//     const { category, leagueName } = req.body;

//     if (!category || !leagueName) {
//       return res.status(400).json({
//         success: false,
//         message: "category and leagueName required"
//       });
//     }

//     const files = req.files || [];

//     let leagueLogo = req.body.leagueLogo || "";
//     let leagueBanner = req.body.leagueBanner || "";

//     for (const file of files) {
//       if (file.fieldname === "leagueLogo") {
//         leagueLogo = await uploadToBunny(file.buffer, `league/logo-${Date.now()}`);
//       }

//       if (file.fieldname === "leagueBanner") {
//         leagueBanner = await uploadToBunny(file.buffer, `league/banner-${Date.now()}`);
//       }
//     }

//     // const sections = await parseSections(req.body, files);

// const sections = await parseSections(req.body, files);

// const now = new Date();

// // 🔴 AUTO + MANUAL LIVE SET
// sections.forEach(section => {
//   section.matches.forEach(match => {

//     // ✅ agar admin ne isLive bheja hai → use karo
//     if (typeof match.isLive === "boolean") return;

//     // ❌ nahi bheja → auto decide karo
//     if (match.matchDateTime) {
//       const matchTime = new Date(match.matchDateTime);

//       if (matchTime <= now) {
//         match.isLive = true;
//       } else {
//         match.isLive = false;
//       }
//     }
//   });
// });
//     const schedule = await Schedule.create({
//       category,
//       leagueName,
//       leagueLogo,
//       leagueBanner,
//       sections
//     });

//     res.status(201).json({
//       success: true,
//       message: "Schedule created",
//       data: schedule
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// /* ================= GET ALL (LOCK SYSTEM) ================= */


// exports.getSchedule = async (req, res) => {
//   try {

//     const schedules = await Schedule.find({ status: "active" })
//       .populate("category", "title icon")
//       .sort({ createdAt: -1 });

//     let userSub = null;

//     if (req.user?.id) {
//       userSub = await Subscription.findOne({
//         user: req.user.id,
//         status: "active",
//         endDate: { $gt: new Date() }
//       }).populate("plan");
//     }

//     const now = new Date();

//     const data = schedules.map((schedule) => {

//       const sections = schedule.sections.map((section) => {

//         const matches = section.matches.map((match) => {

//           let locked = false;

//           const userPlan = userSub?.plan?.title?.toLowerCase();
//           const requiredPlan = match.requiredPlan?.toLowerCase();

//           /* 🔐 LOCK LOGIC */
//           if (match.isPremium) {
//             if (!userSub) locked = true;
//             else if (requiredPlan && userPlan !== requiredPlan) locked = true;
//           }

//           /* 🔴 LIVE LOGIC */
//           // let isLive = match.isLive;

//           // if (!match.isLive && match.matchDateTime) {
//           //   const matchTime = new Date(match.matchDateTime);

//           //   if (matchTime <= now) {
//           //     isLive = true;
//           //   }
//           // }
// let isLive = match.isLive;

// if (match.matchDateTime) {
//   const matchTime = new Date(match.matchDateTime);

//   // auto live
//   if (matchTime <= now) {
//     isLive = true;
//   }

//   // auto end after 3 hours
//   const endTime = new Date(matchTime.getTime() + 3 * 60 * 60 * 1000);

//   if (now > endTime) {
//     isLive = false;
//   }
// }
//           /* 🔚 END LOGIC (3 hour auto end) */
//           let isEnded = false;

//           if (match.matchDateTime) {
//             const matchTime = new Date(match.matchDateTime);
//             const endTime = new Date(matchTime.getTime() + 3 * 60 * 60 * 1000);

//             if (now > endTime) {
//               isLive = false;
//               isEnded = true;
//             }
//           }

//           /* 🔒 HARD LOCK */
//           if (locked) {
//             return {
//               ...match.toObject(),
//               liveUrl: null,
//               viewers: 0,
//               locked: true,
//               isLive: false,
//               status: "locked"
//             };
//           }

//           return {
//             ...match.toObject(),
//             locked: false,
//             isLive,
//             status: isEnded ? "ended" : isLive ? "live" : "upcoming"
//           };
//         });

//         return {
//           ...section.toObject(),
//           matches
//         };
//       });

//       return {
//         ...schedule.toObject(),
//         sections
//       };
//     });

//     res.json({
//       success: true,
//       total: data.length,
//       data
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ================= GET BY CATEGORY ================= */
 
// exports.getScheduleByCategory = async (req, res) => {
//   try {

//     const schedules = await Schedule.find({
//       category: req.params.categoryId,
//       status: "active"
//     }).populate("category", "title icon");

//     res.json({
//       success: true,
//       data: schedules
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// /* ================= GET SINGLE ================= */

// exports.getSingleSchedule = async (req, res) => {
//   try {

//     const schedule = await Schedule.findById(req.params.id)
//       .populate("category", "title icon");

//     if (!schedule) {
//       return res.status(404).json({
//         success: false,
//         message: "Schedule not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: schedule
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// /* ================= UPDATE ================= */

// exports.updateSchedule = async (req, res) => {
//   try {

//     const schedule = await Schedule.findById(req.params.id);

//     if (!schedule) {
//       return res.status(404).json({
//         success: false,
//         message: "Schedule not found"
//       });
//     }

//     const files = req.files || [];

//     if (req.body.category) schedule.category = req.body.category;
//     if (req.body.leagueName) schedule.leagueName = req.body.leagueName;

//     if (req.body.leagueLogo) schedule.leagueLogo = req.body.leagueLogo;
//     if (req.body.leagueBanner) schedule.leagueBanner = req.body.leagueBanner;

//     for (const file of files) {
//       if (file.fieldname === "leagueLogo") {
//         schedule.leagueLogo = await uploadToBunny(file.buffer, `league/logo-${Date.now()}`);
//       }

//       if (file.fieldname === "leagueBanner") {
//         schedule.leagueBanner = await uploadToBunny(file.buffer, `league/banner-${Date.now()}`);
//       }
//     }

//     if (req.body.sections) {
//       schedule.sections = await parseSections(req.body, files);
//     }

//     await schedule.save();

//     res.json({
//       success: true,
//       message: "Updated successfully",
//       data: schedule
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// /* ================= DELETE ================= */

// exports.deleteSchedule = async (req, res) => {
//   try {

//     const deleted = await Schedule.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Schedule not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Deleted successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// exports.toggleLive = async (req, res) => {
//   try {
//     const { scheduleId, sectionIndex, matchIndex } = req.body;

//     const schedule = await Schedule.findById(scheduleId);

//     if (!schedule) {
//       return res.status(404).json({
//         success: false,
//         message: "Schedule not found"
//       });
//     }

//     const match = schedule.sections[sectionIndex]?.matches[matchIndex];

//     if (!match) {
//       return res.status(404).json({
//         success: false,
//         message: "Match not found"
//       });
//     }

//     match.isLive = !match.isLive;

//     await schedule.save();

//     res.json({
//       success: true,
//       message: "Live status updated",
//       isLive: match.isLive
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


const Schedule = require("../models/scheduleModel");
const Subscription = require("../models/Subscription");
const uploadToBunny = require("../utils/uploadToBunny");

/* ================= HELPER ================= */

async function parseSections(body, files = []) {
  let sections = [];

  if (body.sections) {
    sections =
      typeof body.sections === "string"
        ? JSON.parse(body.sections)
        : body.sections;
  }

  for (const file of files) {
    const parts = file.fieldname.split("_");
    if (parts.length !== 3) continue;

    const field = parts[0];
    const sIdx = parseInt(parts[1].replace("s", ""));
    const mIdx = parseInt(parts[2].replace("m", ""));

    if (!sections[sIdx]?.matches?.[mIdx]) continue;

    const fileUrl = await uploadToBunny(
      file.buffer,
      `matches/${field}/${Date.now()}-${file.originalname}`
    );

    if (field === "team1Logo") sections[sIdx].matches[mIdx].team1Logo = fileUrl;
    if (field === "team2Logo") sections[sIdx].matches[mIdx].team2Logo = fileUrl;
    if (field === "matchBanner") sections[sIdx].matches[mIdx].matchBanner = fileUrl;
    if (field === "video") sections[sIdx].matches[mIdx].liveUrl = fileUrl;
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
        leagueLogo = await uploadToBunny(file.buffer, `league/logo-${Date.now()}`);
      }

      if (file.fieldname === "leagueBanner") {
        leagueBanner = await uploadToBunny(file.buffer, `league/banner-${Date.now()}`);
      }
    }

    const sections = await parseSections(req.body, files);

    const now = new Date();

    sections.forEach(section => {
      section.matches.forEach(match => {
        if (typeof match.isLive === "boolean") return;

        if (match.matchDateTime) {
          const matchTime = new Date(match.matchDateTime);
          match.isLive = matchTime <= now;
        }
      });
    });

    const schedule = await Schedule.create({
      category,
      leagueName,
      leagueLogo,
      leagueBanner,
      sections
    });

    res.status(201).json({
      success: true,
      message: "Schedule created",
      data: schedule
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= GET ALL (LOCK SYSTEM) ================= */

exports.getSchedule = async (req, res) => {
  try {

    const schedules = await Schedule.find({ status: "active" })
      .populate("category", "title icon")
      .sort({ createdAt: -1 });

    let userSub = null;

    if (req.user?.id) {
      userSub = await Subscription.findOne({
        user: req.user.id,
        status: "active",
        endDate: { $gt: new Date() }
      }).populate("plan");
    }

    const now = new Date();

    const data = schedules
      .map((schedule) => {

        const sections = schedule.sections.map((section) => {

          const matches = section.matches.map((match) => {

            let locked = false;

            const userPlan = userSub?.plan?.title?.toLowerCase();
            const requiredPlan = match.requiredPlan?.toLowerCase();

            /* 🔐 LOCK LOGIC */
            if (match.isPremium) {
              if (!userSub) locked = true;
              else if (requiredPlan && userPlan !== requiredPlan) locked = true;
            }

            /* 🔴 LIVE + END LOGIC */
            let isLive = match.isLive;
            let isEnded = false;

            if (match.matchDateTime) {
              const matchTime = new Date(match.matchDateTime);
              const endTime = new Date(matchTime.getTime() + 3 * 60 * 60 * 1000);

              if (matchTime <= now) {
                isLive = true;
              }

              if (now > endTime) {
                isLive = false;
                isEnded = true;
              }
            }

            /* 🔒 HARD LOCK */
            if (locked) {
              return {
                ...match.toObject(),
                liveUrl: null,
                viewers: 0,
                locked: true,
                isLive: false,
                status: "locked"
              };
            }

            return {
              ...match.toObject(),
              locked: false,
              isLive,
              status: isEnded ? "ended" : isLive ? "live" : "upcoming"
            };
          });

          return {
            ...section.toObject(),
            matches
          };
        });

        /* ✅ check karo schedule mein koi locked match hai ya nahi */
        const isScheduleLocked = sections.some(s =>
          s.matches.some(m => m.locked === true)
        );

        return {
          ...schedule.toObject(),
          sections,
          _isLocked: isScheduleLocked
        };
      })
      /* ✅ SORT: locked schedules upar, unlocked neeche */
      .sort((a, b) => {
        if (a._isLocked && !b._isLocked) return -1;
        if (!a._isLocked && b._isLocked) return 1;
        return 0;
      })
      /* ✅ _isLocked temporary field hata do final response se */
      .map(({ _isLocked, ...rest }) => rest);

    res.json({
      success: true,
      total: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= GET BY CATEGORY ================= */

exports.getScheduleByCategory = async (req, res) => {
  try {

    const schedules = await Schedule.find({
      category: req.params.categoryId,
      status: "active"
    }).populate("category", "title icon");

    res.json({
      success: true,
      data: schedules
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
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

    if (req.body.leagueLogo) schedule.leagueLogo = req.body.leagueLogo;
    if (req.body.leagueBanner) schedule.leagueBanner = req.body.leagueBanner;

    for (const file of files) {
      if (file.fieldname === "leagueLogo") {
        schedule.leagueLogo = await uploadToBunny(file.buffer, `league/logo-${Date.now()}`);
      }

      if (file.fieldname === "leagueBanner") {
        schedule.leagueBanner = await uploadToBunny(file.buffer, `league/banner-${Date.now()}`);
      }
    }

    if (req.body.sections) {
      schedule.sections = await parseSections(req.body, files);
    }

    await schedule.save();

    res.json({
      success: true,
      message: "Updated successfully",
      data: schedule
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= TOGGLE LIVE ================= */

exports.toggleLive = async (req, res) => {
  try {
    const { scheduleId, sectionIndex, matchIndex } = req.body;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    const match = schedule.sections[sectionIndex]?.matches[matchIndex];

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    match.isLive = !match.isLive;

    await schedule.save();

    res.json({
      success: true,
      message: "Live status updated",
      isLive: match.isLive
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};