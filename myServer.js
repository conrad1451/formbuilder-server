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

app.use(helmet());
app.use(express.json()); // Important: Add this line to parse JSON request bodies!

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

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
    res.send("Added new user via get request (not the way to do it, lol)");
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
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (password !== user.password) { // In a real application, use bcrypt to compare hashed passwords!
            return res.status(401).json({ message: 'Invalid credentials' });
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