const express = require("express");
const DescopeSDK = require('@descope/node-sdk');
const { Client } = require('@notionhq/client'); // Install @notionhq/client

const port = 8000;
const app = express();
app.use(express.json());

// Initialize Descope Backend SDK
const descopeClient = new DescopeSDK({
  projectId: process.env.DESCOPE_PROJECT_ID,
});

// Initialize Notion API client
const notion = new Client({ auth: process.env.NOTION_API_KEY }); // Ensure NOTION_API_KEY is set
const notionDatabaseId = process.env.NOTION_DATABASE_ID; // Ensure NOTION_DATABASE_ID is set

app.post("/targetnotion", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const formData = req.body;
    let jwtToken = null;

    if (!formData || !formData.myName) {
      return res.status(400).json({ error: "Missing form data (myName)." });
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      jwtToken = authHeader.split(' ')[1];
      console.log('Received JWT for Notion:', jwtToken);

      // **--- RECOMMENDED: Verify the JWT using Descope Backend SDK ---**
      try {
        const sessionResponse = await descopeClient.validateSession(jwtToken);
        if (!sessionResponse?.valid) {
          console.error('JWT is invalid for Notion.');
          return res.status(401).json({ error: 'Unauthorized: Invalid JWT' });
        }
        const userId = sessionResponse.session?.userId;
        console.log('JWT is valid. User ID:', userId);

        // **--- Send data to Notion ---**
        if (!notionDatabaseId) {
          console.error('NOTION_DATABASE_ID environment variable not set.');
          return res.status(500).json({ error: 'Notion database ID not configured.' });
        }

        try {
          const notionResponse = await notion.pages.create({
            parent: { database_id: notionDatabaseId },
            properties: {
              Name: { title: [{ text: { content: formData.myName } }] },
              DescopeJWT: { rich_text: [{ text: { content: jwtToken } }] },
              DescopeUserId: { rich_text: [{ text: { content: userId || 'N/A' } }] }, // Optional: Include User ID
              // Add other Notion database properties as needed
            },
          });
          console.log('Data sent to Notion:', notionResponse);
          res.status(201).json({ message: "Data sent to Notion successfully!", data: notionResponse });
        } catch (notionError) {
          console.error('Error sending data to Notion:', notionError);
          return res.status(500).json({ error: 'Failed to send data to Notion.' });
        }

      } catch (error) {
        console.error('Error validating JWT for Notion:', error);
        return res.status(401).json({ error: 'Unauthorized: Error validating JWT' });
      }
      // **--- END JWT Verification ---**

    } else {
      console.error('No JWT found in Authorization header for Notion.');
      return res.status(401).json({ error: 'Unauthorized: No JWT provided' });
    }

  } catch (error) {
    console.error("Error processing request for Notion:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// ... (other routes like /submitformhere, /) ...

app.listen(port, console.log(`Server started on ${port}`));