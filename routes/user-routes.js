const router = require("express").Router({ mergeParams: true });
const { User } = require("../models");
const passpoprt = require("passport");
//===============================================================================
// @route   GET   /users/new
// @desc    SHOW SIGNUP FORM TO THE USER FOR REGISTRATION
// @access  PUBLIC
router.get("/new", (req, res) => {
  res.render("users/new-user.ejs");
});
//===============================================================================
// @route   POST  /users
// @desc    ADD NEW USER TO THE DATABASE BUT FIRST ENCRYPT ITS PASSWORD
// @access  PUBLIC
router.post("/", (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password)
    .then(dbUser => {
      passpoprt.authenticate("local")(req, res, () => {
        res.redirect("/campgrounds");
      });
    })
    .catch(err => {
      console.log("Can not register a new user");
      res.redirect("/users/new");
    });
});
//===============================================================================
module.exports = router;
