const { Schema, model, Types } = require("mongoose");

const designerSchema = new Schema(
  {
    vendor: {
      type: Types.ObjectId,
      required: [true],
      ref: "User",
    },
    description: {
      type: String,
      required: [true],
    },
    title: {
      type: String,
      required: [true, "required."],
      trim: true,
    },
    style: {
      type: String,
      required: [true, "required."],
    },
    image: {
      type: String,
      required: [true, "required."],
    },

    telephone: {
      type: Number,
      required: [true, "required."],
    },
  },
  {
    timestamps: true,
  }
);

designerSchema.index({ title: "text" });

const Designer = model("designer", designerSchema);

module.exports = Designer;
