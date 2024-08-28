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
    const hashedPass = await bcrypt.hash("password", 10);   

    const user = new User({
        email: 'testuser@gmail.com',
        password: hashedPass,
        // password: "testpass",
    });

    // save the user to the database
    await user.save();

    res.send("Hello");
})

app.get('/users', (req, res)=>{
    const myUser = User.findOne({email: 'testuser@gmail.com'});
    res.send(JSON.stringify(myUser));
    console.log(myUser);
    res.send("Success")
})

app.get('/', (req, res)=>{
    res.send('Hello from the server of Conrad');
})

app.listen(process.env.PORT, () =>{
    console.log(`server listening on port ${process.env.PORT}`)
})