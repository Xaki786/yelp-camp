const router = require("express").Router({ mergeParams: true });
const { Campground, Comment, User } = require("../models");
const { isLoggedIn, checkCommentOwnership } = require("../auth-middlewares");
router.use(isLoggedIn);
// =======================================================================
// @route   GET   /campgrounds/:campgroundId/comments/new
// @desc    SHOW USER A NEW COMMENT FORM IF HE IS AUTHENTICATED
// @access  PROTECTED
router.get("/comments/new", (req, res) => {
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
router.post("/comments", (req, res) => {
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
// @route   GET   /campgrounds/:campgroundId/comments/:commentId/edit
// @desc    FIND COMMENT FROM DATABASE AND REDIRECT USER TO THE COMMENT EDIT FORM
// @access  PRIVATE
router.get("/comments/:commentId/edit", checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.commentId)
    .then(dbComment => {
      res.render("comments/edit-comment.ejs", {
        ejsComment: dbComment,
        campgroundId: req.params.campgroundId
      });
    })
    .catch(err => {
      console.log("Can not find comment while showing edit form");
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    });
});
// =======================================================================
// @route   PUT   /campgrounds/:campgroundId/comments/:commentId
// @desc    FIND COMMENT FROM THE DATABASE AND UPDATE IT.
//          THEN REDIRECT USER TO THE CAMPGROUND SHOW PAGE
// @access  PRIVATE
router.put("/comments/:commentId", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, {
    new: true
  })
    .then(dbComment => {
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    })
    .catch(err => {
      console.log("Can not find comment while adding edited comment");
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    });
});
// =======================================================================
// @route   DELETE    /campgrounds/:campgroundId/comments/:commentId
// @desc    FIND A COMMENT FROM DATABASE AND DELETE IT...ALSO DELETE IT
//          FROM AUTHOR AND CAMPGROUNDS AND AUTHORS LISTINGS
// @access  PROTECTED
router.delete("/comments/:commentId", checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.campgroundId)
    .then(dbCampground => {
      dbCampground.comments.pull(req.params.commentId);
      dbCampground
        .save()
        .then(dbCampground => {
          Comment.findByIdAndDelete(req.params.commentId)
            .then(dbComment => {
              res.redirect(`/campgrounds/${req.params.campgroundId}`);
            })
            .catch(err => {
              console.log("Can not find comment while deleting comment");
              res.redirect(`/campgrounds/${req.params.campgroundId}`);
            });
        })
        .catch(err => {
          console.log("Can not save campground while deleting comment");
          res.redirect(`/campgrounds/${req.params.campgroundId}`);
        });
    })
    .catch(err => {
      console.log("Can not find campground while deleting comment");
      res.redirect(`/campgrounds/${req.params.campgroundId}`);
    });
});
// =======================================================================
module.exports = router;
