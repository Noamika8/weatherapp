import express from 'express';
import fetch from 'node-fetch';
const app = express();
const port = 3000;

// Get your api key from https://openweathermap.org/price free plan
// Load your api key via 'API_KEY' environment variable
// const apiKey = process.env.API_KEY;
// TODO: delete this 
const apiKey = "dac27ca016b408077fa7571e14d3261f";
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/weather/:city', async (req, res) => {
    // Example city names: Haifa, Tel-aviv, London, Bangkok, New-york
    const city = req.params.city;
    if (apiKey===undefined) {
        throw new Error('Missing api key');
    }
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
    console.log(url);
    try {
        const response = await fetch(url);
        console.log(response);
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
