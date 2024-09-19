// source: 
// [1]: https://www.programiz.com/javascript/examples/generate-random-strings 
// [2]: https://stackoverflow.com/questions/16743729/mongodb-find-if-a-collection-is-empty-node-js
require('dotenv').config();
const User = require("./models/Users");

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt= require("bcrypt");
const Users = require('./models/Users');


app.use(cors())

// const userSchema = new mongoose.Schema({
//     username:{
//         type: String, 
//         required: true,
//         unique: true,
//         trim: true
//     },
//     email:{
//         type: String, 
//         required: true,
//         unique: true,
//         trim: true
//     },
//     password:{
//         type: String, 
//         required: true,
//     }   
// })
// module.exports = mongoose.model("User", userSchema);

mongoose.connect(process.env.MONGODB_CONNECTION);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB");
});


app.get('/mytestpage', async (req, res)=>{
    // const nonhashedPass = "password"; // CHQ: for testing in case the hash causes issues
    const hashedPass = await bcrypt.hash("password", 10);   

    const randomUsername = Math.random().toString(36).substring(2,7); //[1]
    // const randomEmail = randomUsername + "@gmail.com";
    const randomEmail = String(randomUsername + "@gmail.com");

    const randomPass = await bcrypt.hash((randomUsername+"@passphrase"), 10);  

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

    // save the user to the database
    await user.save();
    // await user.updateOne("k", "k", "l")

    res.send("Hello");
})

app.post("/signup", async (req, res) => {
    const myData = req.body;
    //console.log();
    console.log(myData);

    // FIXME: CHQ: the following lines (createdUser and saving it) fail because "TypeError: Cannot read properties of undefined (reading 'username')"
    const createdUser = new User({
        username: myData.username,
        email: myData.email,
        // username: 'myusername',
        // email: 'testuser@gmail.com',
        password: myData.password
        // password: hashedPass,
        // password: "testpass",
    });

    await createdUser.save();

    })

app.get('/users', async (req, res)=>{

    // app.get('/users', (req, res)=>{
    // CHQ: This is hard coded. might cause issues 
    // const myUser = User.findOne({email: 'testuser@gmail.com'});
    // const hasUsers = User.length > 0


    const firstUserFound = User.findOne({email: 'k7nti@gmail.com'});
    const secondUserFound = User.findOne({email: 'yv7rl@gmail.com'});

    const allFOund = [firstUserFound, secondUserFound];

    let foundString = "";

    allFOund.forEach(element => {
        // foundString += element.username;
        foundString += element.username;
    });

    // db.users.find()
    // FIXME: terminal yelled "TypeError: Converting circular structure to JSON" stackoverflow" 
    // res.send(JSON.stringify(myUser)); 
    // Let's try returning just the email
    // console.log(myUser);
    // res.send("Success")

    // if(hasUsers)
    // {
    //     // for (let index = 0; index < User.length; ++index) {
    //         const stringifiedList = [];

    //     for (let index = 0; index < User.length; index++) {
    //         const curUser = User[index];

    //         stringifiedList.push(JSON.stringify(curUser));
            
    //     }
    //     res.send(stringifiedList);
    // }
    // else
    // {
    //     res.send("There are no users in the database!")
    // }


    // console.
    console.log("Hi")
    console.error("testing something")
    // console.error(db.collection.name)
    // console.error(db.collection) // result is: [Function (anonymous)]
    // console.error(db)
     // CHQ: error msg: db.collection.count(function (err, count)  is not a function
    // db.collection.count(function (err, count) {
    //     if (!err && count === 0) {
    //         // populateDB();
    //         res.send("should populateDB")
    //     }
    //     else{
    //         res.send("I dont know what to do")
    //     }
    // }); //[2]
    // res.send("The DB collection name is" + String(db.collection.name)) // db collection name is blank
    // res.send("The DB collection name is" + db.collection.name);
    // res.send("The DB collection name is" + db.collection.name);
    console.error(firstUserFound);

    // res.send("all the users found are" + foundString); // chq; didnt work
    // res.send("size of the users collection is" + String(test.users.totalSize())) // test is not defined
    res.send("size of the users collection is" + String(db.users.totalSize())) // test is not defined
})

app.get('/', (req, res)=>{
    res.send('Hello from the server of Conrad');
})

app.listen(process.env.PORT, () =>{
    console.log(`server listening on port ${process.env.PORT}`)
})