const { Campground, User } = require("../models");
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
  }
};
