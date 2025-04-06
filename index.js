require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {
  const url = 'https://api.hubspot.com/crm/v3/objects/companies';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    res.json(response.data.results); // Just returns JSON of company list
  } catch (error) {
    console.error('Error fetching companies:', error.response?.data || error.message);
    res.status(500).send('Something went wrong');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
