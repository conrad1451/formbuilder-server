// source: 
// [1]: https://expressjs.com/en/guide/routing.html

// testing routing found in express.js docs

require('dotenv').config();
const User = require("./models/Users");

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt= require("bcrypt");
const Users = require('./models/Users');

const helmet = require("helmet");
const birds = require('./birds')

// ...

app.use('/birds', birds)


app.use(helmet());

// CHQ: not sure if I need the below line
// app.use(cors())
 
 
app.get('/', (req, res)=>{
    res.send('Hello from the server of Conrad');
})

app.listen(process.env.PORT, () =>{
    console.log(`server listening on port ${process.env.PORT}`)
})