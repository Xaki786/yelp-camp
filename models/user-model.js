const mongoose = require("mongoose");
const Campground = require("./index").Campground;
const PassportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  campgrounds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campground"
    }
  ]
});

userSchema.plugin(PassportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
