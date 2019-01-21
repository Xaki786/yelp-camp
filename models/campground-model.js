const mongoose = require("mongoose");
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
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
