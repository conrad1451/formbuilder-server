const express = require("express");
// const moduleToFetch = require("./index");
// const getDatabase = moduleToFetch.getDatabase;
// const postNewEntry = moduleToFetch.postNewEntry;

 const port = 8000;
const app = express();
const DescopeSDK = require('@descope/node-sdk');
app.use(express.json());

console.log("DescopeSDK:", DescopeSDK); // Inspect the entire imported object
// Initialize Descope Backend SDK
const descopeClient = new DescopeSDK({ 
    
    projectId: process.env.DESCOPE_PROJECT_ID,
    // ... other options
  });


// Global variable to store the fetched database (if you still use this)
// let cachedDatabase = null;


// Middleware to fetch and cache the database on any GET request
// app.use(async (req, res, next) => {
//     const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://personaldatafrontend.vercel.app"];
//     const origin = req.headers.origin;

//     if (origin && allowedOrigins.includes(origin)) {
//         res.setHeader("Access-Control-Allow-Origin", origin);
//         res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
//         res.setHeader(
//             "Access-Control-Allow-Headers",
//             "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
//         );
//         res.setHeader("Access-Control-Allow-Credentials", true);
//         res.setHeader("Access-Control-Max-Age", 7200);
//     }

//     if (req.method === 'GET' && !cachedDatabase) {
//         try {
//             cachedDatabase = await getDatabase();
//             console.log('Database fetched and cached.');
//         } catch (error) {
//             console.error("Error fetching initial database:", error);
//             return res.status(500).json({ error: "Failed to fetch initial database" });
//         }
//     }
//     next();
// }); 

// Your existing route for submitting the form
app.post("/submitformhere", async (req, res) => {
  try {
    if (!req.body || !req.body.myName) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }
    const formData = req.body;

    // **--- DESCOPE DATABASE INTERACTION ---**
    try {
      const response = await descopeClient.management.data.create({
        collection: 'myFormSubmissions', // Choose a collection name
        record: formData, // The data from your form
      });
      console.log('Data stored in Descope:', response);
      res.status(201).json({ message: "Form submitted and data stored successfully!", data: response });
    } catch (descopeError) {
      console.error('Error storing data in Descope:', descopeError);
      return res.status(500).json({ error: 'Failed to store data in Descope.' });
    }
    // **--- END DESCOPE DATABASE INTERACTION ---**

  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// ... your other routes ...

app.get("/", (req, res) => {
    res.json("hello world")
});

app.listen(port, console.log(`Server started on ${port}`));