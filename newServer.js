// source: 
// [1]: https://expressjs.com/en/guide/routing.html

// testing routing found in express.js docs

require('dotenv').config(); 

const express = require("express");
const app = express(); 

const helmet = require("helmet");
const birds = require('./pageRoutes/birds')
const myMongoDB = require('./pageRoutes/secondMongoServer')
 
app.use('/birds', birds)

// CHQ: The below can still do the same CRUD operations as
// if the code were in the server file being run
app.use('/database', myMongoDB)
 

app.use(helmet());

// CHQ: not sure if I need the below line
// app.use(cors())
 
 
app.get('/', (req, res)=>{
    res.send('Hello from the server of Conrad');
})

app.listen(process.env.PORT, () =>{
    console.log(`server listening on port ${process.env.PORT}`)
})