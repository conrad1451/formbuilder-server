// source: 
// [1]https://www.programiz.com/javascript/examples/generate-random-strings 

require('dotenv').config();
const User = require("./models/Users");

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt= require("bcrypt");


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

    res.send("Hello");
})

app.get('/users', async (req, res)=>{

    // app.get('/users', (req, res)=>{
    // CHQ: This is hard coded. might cause issues 
    const myUser = User.findOne({email: 'testuser@gmail.com'});
    const hasUsers = User.length > 0
    // FIXME: terminal yelled "TypeError: Converting circular structure to JSON" stackoverflow" 
    // res.send(JSON.stringify(myUser)); 
    // Let's try returning just the email
    // console.log(myUser);
    // res.send("Success")

    if(hasUsers)
    {
        // for (let index = 0; index < User.length; ++index) {
            const stringifiedList = [];

        for (let index = 0; index < User.length; index++) {
            const curUser = User[index];

            stringifiedList.push(JSON.stringify(curUser));
            
        }
        res.send(stringifiedList);
    }
    else
    {
        res.send("There are no users in the database!")
    }
})

app.get('/', (req, res)=>{
    res.send('Hello from the server of Conrad');
})

app.listen(process.env.PORT, () =>{
    console.log(`server listening on port ${process.env.PORT}`)
})