require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const bannerRoutes = require("./routes/bannerRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const highlightRoutes = require("./routes/highlightRoutes");
const liveTvRoutes = require("./routes/liveTvRoutes");
const prematchRoutes = require("./routes/prematchRoutes");
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const matchRoutes = require("./routes/matchRoutes")
const categoryRoutes = require("./routes/categoryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("🔥 MongoDB Connected"))
.catch(err=>console.log("Mongo Error:",err));

app.use("/api/admin", require("./routes/adminAuthRoutes"));
app.use("/api/banners", bannerRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/highlight", highlightRoutes);
app.use("/api/live-tv", liveTvRoutes);
app.use("/api/prematch", prematchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);          // 🔥 plans
app.use("/api/subscription", require("./routes/subscriptionRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/premium", require("./routes/premiumContentRoutes"));
app.use("/api/highlight-category", require("./routes/highlightCategoryRoutes"));
app.use("/api/categories", categoryRoutes);
app.use("/api/notifications", notificationRoutes);
const channelCategoryRoutes = require("./routes/channelCategoryRoutes");

app.use("/api/channel-categories", channelCategoryRoutes);


app.listen(process.env.PORT || 9000, ()=>{
  console.log("Server running 🔥");
});




