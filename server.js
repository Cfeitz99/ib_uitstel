const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url} from ${req.ip}`);
    next();
});

app.get('/', async (req, res) => {
  const { ib_deal_id } = req.query;

  if (ib_deal_id) {
    try {
      // Updated Zapier webhook URL
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/14846189/2sx7ea1/';

      // Trigger Zapier webhook
      await axios.post(zapierWebhookUrl, { ib_deal_id });
      console.log(`Webhook triggered for ib_deal_id ${ib_deal_id}`);

      // Call FastAPI endpoint to update HubSpot deal properties
      const fastapiEndpoint = 'https://your-fastapi-endpoint.com/update-hubspot-deal';
      const fastapiPayload = { ib_deal_id };

      const fastapiResponse = await axios.post(fastapiEndpoint, fastapiPayload);
      console.log(`FastAPI call successful for ib_deal_id ${ib_deal_id}:`, fastapiResponse.data);
    } catch (error) {
      console.error(`Error handling ib_deal_id ${ib_deal_id}:`, error.message);
    }
  } else {
    console.warn('No ib_deal_id provided in request.');
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
