// source: 
// [1]: https://www.programiz.com/javascript/examples/generate-random-strings 
// [2]: https://stackoverflow.com/questions/16743729/mongodb-find-if-a-collection-is-empty-node-js
require('dotenv').config();
const User = require("../models/Users");
const MyModel = require("../models/TestModel")

const express = require("express");
// const app = express();
const router = express.Router();

// const cors = require("cors");
const mongoose = require("mongoose");
// const Users = require('./models/Users');

const helmet = require("helmet");


router.use(helmet());
// https://dev.to/mccauley/accepting-data-from-a-form-and-saving-it-to-mongodb-through-mongoose-47i3
// router.use(express.urlencoded({extended: true}))

//  📌 Set the view engine to ejs 
// router.set("view engine", "ejs")

// CHQ: not sure if I need the below line
// router.use(cors())
 
// mongoose.connect(process.env.MONGODB_CONNECTION);
mongoose.connect(process.env.MONGODB_CONNECTION);
   
const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB");
});

router.get('/mytestpage', async (req, res)=>{
    // const nonhashedPass = "password"; // CHQ: for testing in case the hash causes issues
    const randomUsername = Math.random().toString(36).substring(2,7); //[1]
    // const randomEmail = randomUsername + "@gmail.com";
    const randomEmail = String(randomUsername + "@gmail.com");
 
    const randomPass = String(randomUsername + "pass");
 
    // const randomEmail = (Math.random().toString(36).substring(2,7);

    const user = new User({
        username: randomUsername,
        email: randomEmail,
        // username: 'myusername',
        // email: 'testuser@gmail.com',
        password: randomPass
        // password: hashedPass,
        // password: "testpass",
    });

    // save the user to the database -> THIS SAVES IT TO THE USER DATABASE
    await user.save();
    // await user.updateOne("k", "k", "l")

    res.send("Added new user via get request (not the way to do it, lol)");
})

router.get('/mysecondtestpage', async (req,res) =>{
    const randomString = Math.random().toString(36).substring(2,7); //[1]

    const theMyString = new User({
        mystring: randomString
    });
    await theMyString.save();
    // await user.updateOne("k", "k", "l")

    res.send("Hello");
})
 
router.get('/', (req, res)=>{
    res.send('Hello from the SECOND server of Conrad');
}) 

module.exports = router