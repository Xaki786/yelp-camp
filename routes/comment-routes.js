const router = require("express").Router({ mergeParams: true });
const { Campground, Comment, User } = require("../models");
const { isLoggedIn } = require("../auth-middlewares");
// =======================================================================
// @route   GET   /campgrounds/:campgroundId/comments/new
// @desc    SHOW USER A NEW COMMENT FORM IF HE IS AUTHENTICATED
// @access  PROTECTED
router.get("/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.campgroundId)
    .then(dbCampground => {
      res.render("comments/new-comment.ejs", { ejsCampground: dbCampground });
    })
    .catch(err => {
      console.log("Campground not found while showing new comment form");
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    });
});
// =======================================================================
// @route   POST    /campgrounds/:campgroundId/comments
// @desc    ADD NEW COMMENT TO THE DATABASE AND REDIRECT TO THE CAMPGROUND SHOW PAGE
// @access  PRIVATE
router.post("/comments", isLoggedIn, (req, res) => {
  const newComment = req.body.comment;
  newComment.author = req.user;
  Comment.create(newComment)
    .then(dbComment => {
      Campground.findById(req.params.campgroundId)
        .then(dbCampground => {
          dbCampground.comments.push(dbComment);
          dbCampground
            .save()
            .then(dbCampground => {
              res.redirect(`/campgrounds/${req.params.campgroundId}`);
            })
            .catch(err => {
              console.log("Can not save campground after adding new comment");
              res.redirect(`/campgrounds/${req.params.campgroundId}`);
            });
        })
        .catch(err => {
          console.log("Campground not found while adding new comment");
          res.redirect(`/campgrounds/${req.params.campgroundId}`);
        });
    })
    .catch(err => {
      console.log("Can not create a new comment");
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    });
});
// =======================================================================
module.exports = router;
