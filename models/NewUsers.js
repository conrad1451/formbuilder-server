const { default: mongoose } = require("mongoose");

// Define a schema for users in database1
const userSchemaDB1 = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define a model for users in database1
// Assuming you have a Mongoose connection object named 'db1' for database1
const NewUser = db1.model("NewUser", userSchemaDB1);

// Define a schema for JWT tokens in database2
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

// Define a model for JWT tokens in database2
// Assuming you have a Mongoose connection object named 'db2' for database2
const JWTModel = db2.model("JWT", jwtSchemaDB2);
// const JWTModel = db2.model("JWTUser", jwtSchemaDB2);

module.exports = { NewUser, JWTModel };

// The commented-out code seems to be a different user schema and model.
// If you intend to use it, you'll need to uncomment it and ensure
// it's connected to the correct database if it's different.
//
// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// //Export the model
// module.exports = mongoose.model("User", userSchema);
