const Listing = require("../models/listingModel");
const mbxClient = require("@mapbox/mapbox-sdk");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const getAllListings = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

const renderNewListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

const showSingleListing = async (req, res) => {
  const id = req.params.id;
  const foundListing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!foundListing) {
    req.flash("error", "Requested Property Not Found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing: foundListing });
};

const createListing = async (req, res) => {
  let { title, description, price, location, country, category } = req.body;
  let coordinatesResponse = await geocodingClient
    .forwardGeocode({
      query: location + ", " + country,
      limit: 1,
    })
    .send();
  let imageURL = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing({
    title: title,
    description: description,
    image: { filename: filename, url: imageURL },
    price: price,
    location: location,
    country: country,
    category: category,
  });
  newListing.owner = req.user._id;
  newListing.locationCoordinates =
    coordinatesResponse.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "Property listing was successfully created");
  res.redirect("/listings");
};

const renderEditListingForm = async (req, res) => {
  const id = req.params.id;
  const foundListing = await Listing.findById(id);
  if (!foundListing) {
    req.flash("error", "Requested Property Not Found");
    res.redirect("/listings");
  }
  let originalImageURL = foundListing.image.url;
  originalImageURL = originalImageURL.replace("/upload", "/upload/h_300,w_500");
  res.render("listings/edit.ejs", {
    listing: foundListing,
    originalImageURL: originalImageURL,
  });
};

const updateListing = async (req, res) => {
  const id = req.params.id;
  let { title, description, price, location, country, category } = req.body;

  let updatedListing = await Listing.findByIdAndUpdate(id, {
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
    category: category,
  });

  if (typeof req.file !== "undefined") {
    let image = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { filename: filename, url: image };
    await updatedListing.save();
  }

  req.flash("success", "Property listing was successfully updated.");
  res.redirect(`/listings/${id}`);
};

const deleteListing = async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Property listing was successfully deleted");
  res.redirect("/listings");
};

module.exports = {
  getAllListings,
  renderNewListingForm,
  showSingleListing,
  createListing,
  renderEditListingForm,
  updateListing,
  deleteListing,
};
