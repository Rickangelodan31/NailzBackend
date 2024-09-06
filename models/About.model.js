const { Schema, model, Types } = require("mongoose");

const aboutSchema = new Schema({
  id: {
    type: String,
  },
  name: { typr: String },

  age: { type: Number },

  profileImage: {
    type: File,
    required: true,
  },

  gitHub: { type: String, required: true, trim: true },
});

designerSchema.index({ title: "text" });

const Designer = model("designer", designerSchema);

module.exports = Designer;
