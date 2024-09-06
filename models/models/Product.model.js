const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: {
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
    imageUrl: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // This will be your sister's user ID
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);
module.exports = Product;
