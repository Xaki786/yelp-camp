const router = require("express").Router({ mergeParams: true });
const Campground = require("../models").Campground;
// ======================================================================
// @route   GET   /campgrounds
// @desc    Retrieve all campgrounds from database and display them
// @access  PUBLIC
// ======================================================================

router.get("/", (req, res) => {
  Campground.find({})
    .then(dbCampgrounds => {
      res.render("campgrounds/campgrounds.ejs", {
        ejsCampgrounds: dbCampgrounds
      });
    })
    .catch(err => {
      console.log("Error finding campgrounds");
      res.redirect("/");
    });
});

// ======================================================================
// @route    GET   /campgrounds/new
// @desc     SHOW FORM FOR ADDING NEW CAMPGROUND
// @access   PUBLIC
// ======================================================================
router.get("/new", (req, res) => {
  res.render("campgrounds/new-campground.ejs");
});

// ======================================================================
// @route     POST    /campgrounds
// @desc      ADD NEW CAMPGROUND TO THE DATABASE AND REDIRECT TO CAMPGROUNDS PAGE
// @access    PRIVATE

router.post("/", (req, res) => {
  const campground = req.body.campground;
  Campground.create(campground)
    .then(dbCampground => {
      res.redirect("/campgrounds");
    })
    .catch(err => {
      console.log("Error creating new campground");
      res.redirect("/campgrounds");
    });
});
// ======================================================================
// @route   GET   /campgrounds/:campgroundId
// @desc    FIND SPECIFIC CAMPGROUND FROM DATABASE AND RENDER ITS SHOW PAGE
// @access  PUBLIC
router.get("/:campgroundId", (req, res) => {
  Campground.findById(req.params.campgroundId)
    .then(dbCampground => {
      res.render("campgrounds/show-campground.ejs", {
        ejsCampground: dbCampground
      });
    })
    .catch(err => {
      console.log("Campground Not Found");
      res.redirect("/campgrounds");
    });
});
// ======================================================================
module.exports = router;
