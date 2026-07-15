import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    galleryName: {
      type: String,
      required: true,
      trim: true,
    },

    galleryImage: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
    },

    category: {
      type: String,
      enum: [
        "Beach",
        "Mountain",
        "Hill Station",
        "Temple",
        "Historical",
        "Wildlife",
        "Adventure",
        "Waterfall",
        "Lake",
        "Desert",
        "City",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    bestTimeToVisit: {
      type: String,
    },

    openingHours: {
      type: String,
    },

    entryFee: {
      type: String,
      default: "Free",
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;