

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

  fullName: String,

  email: {
    type: String,
    unique: true
  },

  phone: String,
  dob: Date,

  password: String,

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