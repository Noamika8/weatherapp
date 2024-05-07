let fetch;
(async () => {
    const fetchModule = await import('node-fetch');
    fetch = fetchModule.default;
})();

const express = require('express');
const app = express();
const port = 3000;

const apiKey = process.env.API_KEY;
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    if (apiKey === undefined) {
        throw new Error('Missing API key');
    }
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data, server responded with status code: ' + response.status);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
