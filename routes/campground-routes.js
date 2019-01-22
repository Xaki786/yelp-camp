const router = require("express").Router({ mergeParams: true });
const { Campground, User } = require("../models");
const { isLoggedIn, checkCampgroundOwnership } = require("../auth-middlewares");
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
});
// ======================================================================
// @route   GET   /campgrounds/:campgroundId/edit
// @desc    CHECK IF CURRENT USER IS THE OWNER OF CAMPGROUND AND
//          SHOW USER A CAMPGROUND EDIT FORM
// @access  PROTECTED
router.get(
  "/:campgroundId/edit",
  isLoggedIn,
  checkCampgroundOwnership,
  (req, res) => {
    Campground.findById(req.params.campgroundId)
      .then(dbCampground => {
        res.render("campgrounds/edit-campground.ejs", {
          ejsCampground: dbCampground
        });
      })
      .catch(err => {
        console.log("Campground not found for edit form");
        res.redirect("/campgrounds");
      });
  }
);
//=================================================================
// @route   PUT   /campgrounds/:campgroundId
// @desc    FIND CAMPGROUND FROM DATABASE AND UPDATE IT
// @desc    PRIVATE
router.put(
  "/:campgroundId",
  isLoggedIn,
  checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndUpdate(req.params.campgroundId, req.body.campground, {
      new: true
    })
      .then(dbCampground => {
        res.redirect(`/campgrounds/${req.params.campgroundId}`);
      })
      .catch(err => {
        console.log("Campground not found during put request");
        res.redirect(`/campgrounds/${req.params.campgroundId}`);
      });
  }
);
//=================================================================
// @route   DELETE    /campgrounds/:campgroundId
// @desc    FIND CAMPGROUND FROM THE DATABASE AND DELETE IT
// @access  PROTECTED
router.delete(
  "/:campgroundId",
  isLoggedIn,
  checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndDelete(req.params.campgroundId)
      .then(() => {
        res.redirect("/campgrounds");
      })
      .catch(err => {
        console.log("Can not delete a campground");
        res.redirect(`/campgrounds/${req.params.campgroundId}`);
      });
  }
);
//=================================================================

module.exports = router;
