const Listing = require("./models/listingModel");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schemaValidation.js");
const Review = require("./models/reviewModel.js");

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You are not authenticated");
    res.redirect("/login");
  }
  return next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  return next();
};

const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash(
      "error",
      "Unauthorized to perform any operation on this property"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//! Validate Listing
const validateListing = (req, res, next) => {
  let { error, value } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

//! Validate Review
const validateReview = (req, res, next) => {
  let { error, value } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

const isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "Unauthorized to delete review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = {
  isAuthenticated,
  saveRedirectUrl,
  isOwner,
  validateListing,
  validateReview,
  isReviewAuthor,
};
