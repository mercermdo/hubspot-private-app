require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// 🔌 Middleware (must come before routes)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// 🧠 View engine
app.set('view engine', 'pug');

// 🏠 Homepage route
app.get('/', async (req, res) => {
  const url = 'https://api.hubspot.com/crm/v3/objects/companies?properties=name,domain';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const companies = response.data.results;
    res.render('homepage', { title: 'Companies', companies });
  } catch (error) {
    console.error('Error fetching companies:', error.response?.data || error.message);
    res.status(500).send('Something went wrong');
  }
});

// 🆕 New company form page
app.get('/new-company', (req, res) => {
  res.render('new-company', { title: 'Create a Company' });
});

// ➕ Create company (form submission)
app.post('/create-company', async (req, res) => {
  const url = 'https://api.hubspot.com/crm/v3/objects/companies';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const newCompany = {
    properties: {
      name: req.body.name,
      domain: req.body.domain
    }
  };

  try {
    await axios.post(url, newCompany, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating company:', error.response?.data || error.message);
    res.status(500).send('Failed to create company');
  }
});

// 🚀 Start server (last thing)
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
