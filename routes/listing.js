const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const {
  getAllListings,
  renderNewListingForm,
  showSingleListing,
  createListing,
  renderEditListingForm,
  updateListing,
  deleteListing,
} = require("../controllers/listing.js");
const {
  isAuthenticated,
  isOwner,
  validateListing,
} = require("../middleware.js");

router
  .route("/")
  .get(wrapAsync(getAllListings))
  .post(
    isAuthenticated,
    upload.single("image"),
    validateListing,
    wrapAsync(createListing)
  );

//! New Listing Route
router.get("/new", isAuthenticated, renderNewListingForm);

router
  .route("/:id")
  .get(wrapAsync(showSingleListing))
  .put(
    isAuthenticated,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isAuthenticated, isOwner, wrapAsync(deleteListing));

//! Edit Listing Route
router.get(
  "/:id/edit",
  isAuthenticated,
  isOwner,
  wrapAsync(renderEditListingForm)
);

module.exports = router;
