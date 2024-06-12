const { Schema, model, Types } = require("mongoose");

const designerSchema = new Schema(
  {
    vendor: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    style: {
      type: String,
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    telephone: {
      type: Number,
      required: [true, "Telephone is required."],
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true, // This correctly enables timestamps
  }
);

const Designer = model("Designer", designerSchema);

module.exports = Designer;
