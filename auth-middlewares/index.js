const { Campground, User, Comment } = require("../models");
const mongoose = require("mongoose");
const passport = require("passport");
module.exports = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },
  checkCampgroundOwnership: function(req, res, next) {
    Campground.findById(req.params.campgroundId)
      .then(dbCampground => {
        if (dbCampground.author.equals(req.user.id)) {
          return next();
        }
        res.redirect(`/campgrounds/${req.params.campgroundId}`);
      })
      .catch(err => {
        console.log("Campground not found during autherization", err);
        res.redirect(`/campgrounds/${req.params.campgroundId}`);
      });
  },
  checkCommentOwnership: function(req, res, next) {
    Comment.findById(req.params.commentId)
      .then(dbComment => {
        if (dbComment.author.equals(req.user.id)) {
          return next();
        }
        return res.redirect(`/campgrounds/${req.params.campgroundId}`);
      })
      .catch(err => {
        console.log("Comment not found during autherization");
        res.redirect(`/campgrounds/${req.params.campgroundId}`);
      });
  }
};
