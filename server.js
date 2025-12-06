require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

const DescopeClient = require("@descope/node-sdk");
const mongoAuth = require("./middleware/mongoAuth.js");
const validateSession = require("./middleware/descopeAuth"); // You might not need this for *just* storing the JWT

// Initialize Descope client (Make sure to replace the placeholder)
try {
  const descopeClient = DescopeClient({
    projectId: process.env.DESCOPE_PROJECT_ID,
  });
} catch (error) {
  console.log("failed to initialize: " + error);
}

const ENVARS = {
  HARDCODED_POSTING_TEST: process.env.MONGODB_CHOSENDB_TARGET,
  LOCAL_FRONTEND: process.env.FRONTEND_ON_LOCALHOST,
  MONGO_LOGIN: process.env.MONGODB_FORMBUILDER_LOGIN,
  MONGO_DESCOPE_USER_DATASTORE:
    process.env.MONGODB_CHOSENDB_DESCOPE_USER_DATASTORE,
};

// Middleware setup
app.use(helmet());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// CORS setup
const corsOptions = {
  origin: ENVARS.LOCAL_FRONTEND,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// MongoDB connection
//   mongoose.connect(ENVARS.HARDCODED_POSTING_TEST)
mongoose
  .connect(ENVARS.MONGO_LOGIN)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// const db = mongoose.connection;

// Create the connections
const db1 = mongoose.createConnection(ENVARS.MONGO_LOGIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db2 = mongoose.createConnection(ENVARS.MONGO_DESCOPE_USER_DATASTORE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });
db1.on("error", console.error.bind(console, "MongoDB connection error:"));
db1.once("open", () => {
  console.log("Connected to MongoDB for login");
});

db2.on("error", console.error.bind(console, "MongoDB connection error:"));
db2.once("open", () => {
  console.log("Connected to MongoDB for descope");
});

// Protected routes using Descope authentication
// app.get('/protected', validateSession, (req, res) => {
//     res.json({ message: 'Protected route accessed' });
// });
app.get("/protected", validateSession, async (req, res) => {
  try {
    res.json({ message: "Protected route accessed" });
  } catch (error) {
    console.log("Could not validate user session " + error);
    res.status(401).json({ message: "Authentication failed" });
  }
});

app.post("/mongodescopedatastore", mongoAuth.storeJWT);

// app.post("/mongo-signup", mongoAuth.createUser);

// app.post("/mongo-register", mongoAuth.createUser);

// Legacy MongoDB auth routes
// app.post("/mongo-login", mongoAuth.login);

// app.post("/mongo-signup", mongoAuth.createUser);

// app.post("/mongo-register", mongoAuth.createUser);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
