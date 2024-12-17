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
  const { deal_id } = req.query;

  // Trigger the webhook for every request with a deal_id
  if (deal_id) {
    try {
      await axios.post('https://hooks.zapier.com/hooks/catch/16510018/22txdqu/', { deal_id });
      console.log(`Webhook triggered for deal_id ${deal_id}`);
    } catch (error) {
      console.error(`Failed to trigger webhook for deal_id ${deal_id}: ${error}`);
    }
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
