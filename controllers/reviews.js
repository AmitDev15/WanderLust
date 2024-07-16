const Listing = require("../models/listingModel");
const Review = require("../models/reviewModel");

module.exports.createReview = async (req, res, next) => {
  const id = req.params.id;
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview } });
  await newReview.save();
  req.flash("success", "Property review added successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Property review deleted successfully");
  res.redirect(`/listings/${id}`);
};
