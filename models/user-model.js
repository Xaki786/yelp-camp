const mongoose = require("mongoose");
const PassportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(PassportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
