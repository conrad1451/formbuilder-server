const DescopeClient = require('@descope/node-sdk');

// Initialize Descope client
const descopeClient = DescopeClient({ 
    projectId: process.env.DESCOPE_PROJECT_ID 
});

// Add session validation middleware
async function validateSession(req, res, next) {
    try {
        const sessionToken = req.headers.authorization?.split(' ')[1];
        const authInfo = await descopeClient.validateSession(sessionToken);
        req.user = authInfo;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid session" });
    }
}

// Update your login route to use Descope
app.post('/login', async (req, res) => {
    // The frontend will handle the authentication flow
    // Your backend just needs to validate the session token
    res.json({ message: 'Use Descope Flow for authentication' });
});

// Protect your routes with the middleware
app.get('/protected-route', validateSession, async (req, res) => {
    // Access validated user info from req.user
    const user = await User.findOne({ descopeId: req.user.userId });
    res.json({ data: "Protected data" });
});