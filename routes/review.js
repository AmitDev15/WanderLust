const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");
const {
  validateReview,
  isAuthenticated,
  isReviewAuthor,
} = require("../middleware.js");

//! Add Review Post Route
router.post(
  "/",
  isAuthenticated,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//! Delete Review Route
router.delete(
  "/:reviewId",
  isAuthenticated,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
