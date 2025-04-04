require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

const DescopeClient = require('@descope/node-sdk');
const mongoAuth = require('./middleware/mongoAuth.js');
const validateSession = require('./middleware/descopeAuth');


// // Initialize Descope client
// const descopeClient = DescopeClient({ 
//     projectId: process.env.DESCOPE_PROJECT_ID 
// }); 
// // [(1)](https://docs.descope.com/getting-started/react/nodejs)

try {
    const descopeClient = DescopeClient({ projectId: '__ProjectID__' });
} catch (error) {
    console.log("failed to initialize: " + error)
}

const ENVARS = {
  HARDCODED_POSTING_TEST: process.env.MONGODB_CHOSENDB_TARGET,
  LOCAL_FRONTEND: process.env.FRONTEND_ON_LOCALHOST,
  MONGO_LOGIN: process.env.MONGODB_FORMBUILDER_LOGIN,
};

// Middleware setup
app.use(helmet());
app.use(express.json());
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

// CORS setup
const corsOptions = {
    origin: ENVARS.LOCAL_FRONTEND,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  
  // MongoDB connection
//   mongoose.connect(ENVARS.HARDCODED_POSTING_TEST)
  mongoose.connect(ENVARS.MONGO_LOGIN)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));
  
  const db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log("Connected to MongoDB");
  });


// Protected routes using Descope authentication
// app.get('/protected', validateSession, (req, res) => {
//     res.json({ message: 'Protected route accessed' });
// });
app.get('/protected', validateSession, async (req, res) => {
    try {
        res.json({ message: 'Protected route accessed' });
    } catch (error) {
        console.log("Could not validate user session " + error);
        res.status(401).json({ message: 'Authentication failed' });
    }
});

// Legacy MongoDB auth routes
app.post('/mongo-login', mongoAuth.login);

app.post('/mongo-signup', mongoAuth.createUser);


app.post('/mongo-register', mongoAuth.createUser);


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});