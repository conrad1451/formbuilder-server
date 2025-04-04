const DescopeClient = require('@descope/node-sdk');

const descopeClient = DescopeClient({ 
    projectId: process.env.DESCOPE_PROJECT_ID 
}); 
// [(1)](https://docs.descope.com/getting-started/react/nodejs)

async function validateSession(req, res, next) {
    try {
        const sessionToken = req.headers.authorization?.split(' ')[1];
        const authInfo = await descopeClient.validateSession(sessionToken); [(1)](https://docs.descope.com/getting-started/react/nodejs)
        req.user = authInfo;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid session" });
    }
}

module.exports = validateSession;