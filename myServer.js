// source: 
// [1]: https://www.programiz.com/javascript/examples/generate-random-strings 
// [2]: https://stackoverflow.com/questions/16743729/mongodb-find-if-a-collection-is-empty-node-js

require('dotenv').config();
const User = require("./models/Users");
const MyModel = require("./models/TestModel");

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

const moment = require('moment-timezone');

app.use(helmet());
app.use(express.json()); // Important: Add this line to parse JSON request bodies!

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');



async function getUserWithFormattedTimestamps(userId) {
  try {
    const user = await User.findById(userId);

    User.findOne

    if (!user) {
      return null; // User not found
    }

    const formattedCreatedAt = formatDate(user.createdAt);
    const formattedUpdatedAt = formatDate(user.updatedAt);

    return {
      ...user.toObject(), // Convert Mongoose document to plain object
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
    const yesterday = moment().tz("America/New_York").subtract(1, 'days').startOf('day'); // NYC timezone
    const users = await User.find({
      createdAt: { $gt: yesterday.toDate() },
      // createdAt: { $gt: ISODate("2025-03-19T00:00:00Z") },

      // 
    });
    // console.log("Users created before yesterday:", users.map(user => user.username));

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
      // Access user properties:
      console.log("Username:", user.username);
      console.log("Email:", user.email);
      //Mongoose documents have extra functionality.
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

// Example usage:
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

//test(); //uncomment to test.


const corsOptions = {
    origin: 'http://localhost:3000', // Allow localhost:3000
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Use cors with the specified options

mongoose.connect(process.env.MONGODB_CHOSENDB_TARGET)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB");
});

app.get('/willtestnow', async (req, res) => {
  // test(); //uncomment to test.
  // findUser("gap0g"); // Replace with an actual username

  // const myListOfUsers = findUsersCreatedAfterYesterday();
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

    // GEmini claims that this plantext being sent by this server is being interpreted
    // by the frontend as HTML - so any characters that could be interpreted as a script
    // will cause the browser's security policy to block it. solution - return json
    // res.send("Added new user via get request (not the way to do it, lol)");
    res.json({ message: "User added successfully" });
});

app.get('/', (req, res) => {
    res.send('Hello from the MONGODB server of Conrad');
});

app.get('/givemeinfo', (req, res) => {
    res.send("process.env.MONGODB_CHOSENDB_TARGET" + " is of type " + typeof (process.env.MONGODB_CHOSENDB_TARGET));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        if (password !== user.password) { // In a real application, use bcrypt to compare hashed passwords!
          return res.status(401).json({ message: "Wrong password" });        
        }

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`);
});

