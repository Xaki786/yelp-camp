const mongoose = require("mongoose");
const { User } = require("../models");
const campgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    trim: true
  },
  url: {
    type: String,
    default: "",
    trim: true
  },
  desc: {
    type: String,
    default: "",
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
