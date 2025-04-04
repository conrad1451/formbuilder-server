// source: 
// [1]: https://www.programiz.com/javascript/examples/generate-random-strings 
// [2]: https://stackoverflow.com/questions/16743729/mongodb-find-if-a-collection-is-empty-node-js

require('dotenv').config();
const User = require("../models/Users");
const MyModel = require("../models/TestModel");

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
// const jwt = require("jsonwebtoken"); // Import JWT

const moment = require('moment-timezone');

const ENVARS = {
  HARDCODED_POSTING_TEST: process.env.MONGODB_CHOSENDB_TARGET,
  LOCAL_FRONTEND: process.env.FRONTEND_ON_LOCALHOST,
  JWT_SECRET: process.env.JWT_SECRET, // Add JWT secret from .env
};

app.use(helmet());
app.use(express.json());

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

async function getUserWithFormattedTimestamps(userId) {
  try {
    const user = await User.findById(userId);

    User.findOne

    if (!user) {
      return null;
    }

    const formattedCreatedAt = formatDate(user.createdAt);
    const formattedUpdatedAt = formatDate(user.updatedAt);

    return {
      ...user.toObject(),
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt,
    };
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
}

async function findUsersCreatedAfterYesterday() {
  try {
    const yesterday = moment().tz("America/New_York").subtract(1, 'days').startOf('day');
    const users = await User.find({
      createdAt: { $gt: yesterday.toDate() },
    });

    console.log("Users created before yesterday:", users.length);
    return users;
  } catch (error) {
    console.error("Error finding users:", error);
    return [];
  }
}

async function listUsersCreatedToday() {
  try {
    const todayStart = moment().tz("UTC").startOf('day');
    const todayEnd = moment().tz("UTC").endOf('day');

    const users = await User.find({
      createdAt: {
        $gte: todayStart.toDate(),
        $lte: todayEnd.toDate(),
      },
    });

    const usernames = users.map(user => user.username);

    console.log("Users created today:", usernames);
    return usernames;
  } catch (error) {
    console.error("Error finding users:", error);
    return [];
  }
}

async function findUser(username) {
  try {
    const user = await User.findOne({ username: username });

    if (user) {
      console.log("User found:", user);
      console.log("Username:", user.username);
      console.log("Email:", user.email);
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error finding user:", error);
  }
}

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/New_York",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

async function test() {
  try {
    const user = await getUserWithFormattedTimestamps("gap0g");
    if (user) {
      console.log("User with formatted timestamps:", user);
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.log(error);
  }
}

const corsOptions = {
  origin: ENVARS.LOCAL_FRONTEND,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

mongoose.connect(ENVARS.HARDCODED_POSTING_TEST)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB");
});

app.get('/willtestnow', async (req, res) => {
  findUsersCreatedAfterYesterday();
});

app.get('/listnewusers', async (req, res) => {
  listUsersCreatedToday();
});

app.get('/mytestpage', async (req, res) => {
  const randomUsername = Math.random().toString(36).substring(2, 7);
  const randomEmail = String(randomUsername + "@gmail.com");
  const randomPass = String(randomUsername + "pass");

  const user = new User({
    username: randomUsername,
    email: randomEmail,
    password: randomPass,
  });

  await user.save();

  res.json({ message: "User added successfully" });
});

app.get('/', (req, res) => {
  res.send('Hello from the MONGODB server of Conrad');
});

app.get('/givemeinfo', (req, res) => {
  res.send("process.env.MONGODB_CHOSENDB_TARGET" + " is of type " + typeof (process.env.MONGODB_CHOSENDB_TARGET));
});

app.post('/oldlogin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate JWT token
    // const token = jwt.sign({ userId: user._id }, ENVARS.JWT_SECRET, { expiresIn: '1h' }); // Adjust expiresIn as needed

    const token = // token from descope

    res.json({ message: 'Login successful', token: token }); // Send token in response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});