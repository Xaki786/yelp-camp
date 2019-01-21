const router = require("express").Router({ mergeParams: true });
const User = require("../models").User;
const passpoprt = require("passport");
//===============================================================================
// @route   GET   /
// @desc    SHOW LANDING PAGE TO THE USER
// @access  PUBLIC
router.get("/", (req, res) => {
  res.render("Home.ejs");
});
//===============================================================================
// @route   GET   /register
// @desc    SHOW SIGNUP FORM TO THE USER FOR REGISTRATION
// @access  PUBLIC
router.get("/register", (req, res) => {
  res.render("users/new-user.ejs");
});
//===============================================================================
// @route   POST  /register
// @desc    ADD NEW USER TO THE DATABASE BUT FIRST ENCRYPT ITS PASSWORD
// @access  PUBLIC
router.post("/register", (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password)
    .then(dbUser => {
      passpoprt.authenticate("local")(req, res, () => {
        res.redirect("/campgrounds");
      });
    })
    .catch(err => {
      console.log("Can not register a new user");
      res.redirect("/register");
    });
});
//===============================================================================
// @route   GET   /login
// @desc    SHOW LOGIN FORM TO THE USER
// @access  PUBLIC
router.get("/login", (req, res) => {
  res.render("users/login-user.ejs");
});
//===============================================================================
// @route   POST  /login
// @desc    LOGIN THE USER AND REDIRECT TO THE CAMPGROUNDS PAGE
// @access  PUBLIC
router.post(
  "/login",
  passpoprt.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);
//===============================================================================

module.exports = router;
