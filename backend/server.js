const express = require('express');
const axios = require('axios');  // We'll use axios to call the ML API
const app = express();
const port = 3000;

app.use(express.json()); // to parse JSON request bodies

app.get('/', (req, res) => res.send('Backend is running'));

app.post('/predict', async (req, res) => {
  try {
    // Forward request body to ML API
    const response = await axios.post('http://localhost:5001/predict', req.body);
    res.json(response.data); // Send back ML API response
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error connecting to ML service' });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));