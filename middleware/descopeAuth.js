const DescopeClient = require('@descope/node-sdk');

// const descopeClient = DescopeClient({ 
//     projectId: process.env.DESCOPE_PROJECT_ID 
// }); 

try {
    const descopeClient = DescopeClient({ 
        projectId: process.env.DESCOPE_PROJECT_ID 
    });
} catch (error) {
    console.log("failed to initialize: " + error)
}


// [(1)](https://docs.descope.com/getting-started/react/nodejs)

async function validateSession(req, res, next) {
    try {
        const sessionToken = req.headers.authorization?.split(' ')[1];
        const authInfo = await descopeClient.validateSession(sessionToken); 
        console.log("Successfully validated user session:");
        console.log(authInfo);
        // [(1)](https://docs.descope.com/getting-started/react/nodejs)
        req.user = authInfo;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid session" });
        console.log ("Could not validate user session " + error);
    }
}

module.exports = validateSession;