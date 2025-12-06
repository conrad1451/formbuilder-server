const { default: mongoose } = require("mongoose");

const jwtSchemaDB2 = new mongoose.Schema(
  {
    userjwt: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);
//Export the model
module.exports = mongoose.model("TheJWTUser", jwtSchemaDB2);
