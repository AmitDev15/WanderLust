const mongoose = require("mongoose");
const Review = require("./reviewModel");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "wanderlust-dev/default-image",
      required: true,
    },
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/ddwl4ltd4/image/upload/v1721038622/wanderlust-dev/default-image.jpg",
      set: (value) =>
        value === ""
          ? "https://res.cloudinary.com/ddwl4ltd4/image/upload/v1721038622/wanderlust-dev/default-image.jpg"
          : value,
      required: true,
    },
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  locationCoordinates: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
