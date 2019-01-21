const router = require("express").Router({ mergeParams: true });
const { User } = require("../models");
const passpoprt = require("passport");
//===============================================================================
// @route   GET   /
// @desc    SHOW LANDING PAGE TO THE USER
// @access  PUBLIC
router.get("/", (req, res) => {
  res.render("Home.ejs");
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
// @route   GET   /logout
// @desc    LOGOUT USER AND REDIRECT TO THE CAMPGROUNDS PAGE
// @access  PUBLIC
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});
//===============================================================================

module.exports = router;
