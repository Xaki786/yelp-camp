const mongoose = require("mongoose");
const { User } = require("./index");
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    default: "",
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
