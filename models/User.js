


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    trim: true
  },

  dob: Date,

  password: String,

  // 🔥 Google login
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  profilePic: {
    type: String,
    default: ""
  },

  fcmToken: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
