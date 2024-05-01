const { Schema, model } = require("mongoose");
const { type } = require("os");

// TODO: Please make sure you edit the Book model to whatever makes sense in this case
const designerSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    designer: {
      type: String,
      required: [true, "designer is required."],
      trim: true,
    },
    Style: {
      type: String,
      required: [true, "Style is required."],
    },
    Image: {
      type: String,
      required: [true, "Image is required."],
    },

    Location: {
      type: String+Number,
      required: [true, "Location is required."],
    },
    Telephone: {
      type: Number,
      required: [true, "Telephone is required."],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Designer = model("Designer", designerSchema);

module.exports = Designer;
