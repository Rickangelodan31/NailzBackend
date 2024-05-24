const { Schema, model, Types } = require("mongoose");

const aboutSchema = new Schema(
  {
    CEO:{
        name: "Ricardo Watson",
        age: 32,
        profileImage: "Ricky.png",
        gitHub: "github.jpg",
    },
    
  }
);

designerSchema.index({ title: "text" });

const Designer = model("designer", designerSchema);

module.exports = Designer;
