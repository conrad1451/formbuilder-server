// source: 
// [1]: https://www.programiz.com/javascript/examples/generate-random-strings 
// [2]: https://stackoverflow.com/questions/16743729/mongodb-find-if-a-collection-is-empty-node-js


// source: https://gemini.google.com/app/5bede81cc8a65dac

require('dotenv').config();
const User = require("./models/Users");
const MyModel = require("./models/TestModel") 

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
// const Users = require('./models/Users');

const helmet = require("helmet");


app.use(helmet());
// https://dev.to/mccauley/accepting-data-from-a-form-and-saving-it-to-mongodb-through-mongoose-47i3
// app.use(express.urlencoded({extended: true}))

//  📌 Set the view engine to ejs 
// app.set("view engine", "ejs")

// CHQ: not sure if I need the below line
// app.use(cors())
app.use(cors({
    origin: "https://localhost:3000" // Replace with your frontend origin
    // origin: "http://localhost:3000" // Replace with your frontend origin
  }));

// app.use((req, res, next) => {
//     res.setHeader(
//       "Access-Control-Allow-Origin",
//       "https://react-api-use-test-2.vercel.app"
//     );
//     res.setHeader(
//         "Access-Control-Allow-Origin",
//         "https://localhost:3000/login"
//         "http://localhost:3000/login"
//       );
//     res.setHeader(
//       "Access-Control-Allow-Origin",
//       "*"
//     );
//     //   res.setHeader(
//     //   "Access-Control-Allow-Origin",
//     //   *  
//     // ); // resulted in "unexpected token"
//     // res.setHeader(
//     //   "Access-Control-Allow-Methods",
//     //   "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
//     // );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET,POST,OPTIONS"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
//     );
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     res.setHeader("Access-Control-Allow-Private-Network", true);
//     //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
//     res.setHeader("Access-Control-Max-Age", 7200);
  
//     next();
//   });

// CHQ: format of mongoDB connection string:
// default database "test": prefix+suffix
// specific database: prefix+"DBNAME"suffix
// "DBNAME is a placeholder for the name of the database that you want to access"

// mongoose.connect(process.env.MONGODB_CONNECTION_DEFAULT);

// works on my machine but not when deployed to onrender
// mongoose.connect(process.env.MONGODB_CHOSENDB_TARGET);
mongoose.connect(process.env.MONGODB_CHOSENDB_TARGET)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));


// mongoose.connect(String(process.env.MONGODB_CHOSENDB_TARGET));

// (node:42028) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
// mongoose.connect(String(process.env.MONGODB_CHOSENDB_TARGET), {
//   useNewUrlParser: "true",
//   useUnifiedTopology: "true"
// });

const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB");
});

app.get('/mysecondtestpage', async (req,res) =>{
    const randomString = Math.random().toString(36).substring(2,7); //[1]

    const theMyString = new User({
        mystring: randomString
    });
    await theMyString.save();
    // await user.updateOne("k", "k", "l")

    res.send("Hello");
})
app.get('/mytestpage', async (req, res)=>{
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
    // TypeError: user.insertOne is not a function
    // await user.insertOne();
    // await user.updateOne("k", "k", "l")

    res.send("Added new user via get request (not the way to do it, lol)");
})
,
app.get('/', (req, res)=>{
    res.send('Hello from the MONGODB server of Conrad');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username  
   });
  
      if (!user) {
        return res.status(401).json({  
   message: 'Invalid credentials' });
      }
  
      // Replace with your password verification logic (e.g., bcrypt)
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Successful login, you can generate a token or session here
      res.json({ message: 'Login successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.listen(process.env.PORT, () =>{
    console.log(`server listening on port ${process.env.PORT}`)
})