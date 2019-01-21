const router = require("express").Router({ mergeParams: true });
const { Campground, User } = require("../models");
const { isLoggedIn } = require("../auth-middlewares");
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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new-campground.ejs");
});

// ======================================================================
// @route     POST    /campgrounds
// @desc      ADD NEW CAMPGROUND TO THE DATABASE AND REDIRECT TO CAMPGROUNDS PAGE
// @access    PRIVATE

router.post("/", isLoggedIn, (req, res) => {
  const campground = req.body.campground;
  campground.author = req.user;
  User.findById(req.user.id)
    .then(dbUser => {
      Campground.create(campground)
        .then(dbCampground => {
          dbUser.campgrounds.push(dbCampground);
          dbUser
            .save()
            .then(() => {
              res.redirect("/campgrounds");
            })
            .catch(err => {
              console.log("Error saving user while creating new campground");
              res.redirect("/campgrounds");
            });
        })
        .catch(err => {
          console.log("Error creating new campground");
          res.redirect("/campgrounds");
        });
    })
    .catch(err => {
      console.log("User not found while creating new campground");
      res.redirect("/campgrounds");
    });
});
// ======================================================================
// @route   GET   /campgrounds/:campgroundId
// @desc    FIND SPECIFIC CAMPGROUND FROM DATABASE AND RENDER ITS SHOW PAGE
// @access  PUBLIC
router.get("/:campgroundId", (req, res) => {
  Campground.findById(req.params.campgroundId)
    .populate("author")
    .exec((err, dbCampground) => {
      if (err) {
        console.log("Campground Not Found");
        return res.redirect("/campgrounds");
      }
      res.render("campgrounds/show-campground.ejs", {
        ejsCampground: dbCampground
      });
    });
  // .then(dbCampground => {

  //   });
  // })
  // .catch(err => {

  // });
});
// ======================================================================
module.exports = router;
