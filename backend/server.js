const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;
const ML_API_URL = "http://127.0.0.1:5001/predict";
const WEATHER_API_KEY = process.env.WEATHERAPI_KEY;

// --- Load Transit Data ---
let stationCoords = {};
let stations = {};
try {
    const coordsPath = path.resolve(__dirname, '../frontend/src/data/station_coords.json');
    stationCoords = JSON.parse(fs.readFileSync(coordsPath));
    const stationsPath = path.resolve(__dirname, '../frontend/src/data/stations.json');
    stations = JSON.parse(fs.readFileSync(stationsPath));
    console.log("🚉 Successfully loaded station data.");
} catch (error) {
    console.error("❌ Error loading station data:", error);
}

// --- Middleware & Helpers ---
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

function getDistance(coord1, coord2) {
    if (!coord1 || !coord2) return 0;
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 0.5 - Math.cos(dLat) / 2 + Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

async function getWeather(lat, lon) {
    // Weather function remains the same
    if (!WEATHER_API_KEY) return { weather_idx: 1, status: "API Key Missing", temp: "N/A" };
    try {
        const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`;
        const response = await axios.get(url);
        const { condition, temp_c } = response.data.current;
        let weather_idx = 1;
        if ([1063, 1072, 1087, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246, 1273, 1276].includes(condition.code)) weather_idx = 2;
        else if (condition.code >= 1198 || (condition.code >= 1114 && condition.code <= 1117)) weather_idx = 3;
        return { weather_idx, status: condition.text, temp: `${temp_c}°C` };
    } catch (error) {
        return { weather_idx: 1, status: "Error", temp: "N/A" };
    }
}

// --- Main API Routes ---
app.get("/", (req, res) => res.send("🚄 Tren-PH Backend is running!"));

app.get("/api/weather", async (req, res) => {
    try {
        const weatherData = await getWeather(14.5995, 120.9842);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data." });
    }
});

// --- NEW: Train ETA Endpoint ---
app.post("/api/eta", (req, res) => {
    const { line, station } = req.body;
    if (!line || !station || !stations[line]) {
        return res.status(400).json({ error: "Invalid line or station provided." });
    }

    const lineStations = stations[line].stations;
    const targetStationIndex = lineStations.indexOf(station);

    if (targetStationIndex === -1) {
        return res.status(400).json({ error: "Station not found on the specified line." });
    }

    // SIMULATION LOGIC
    const totalStations = lineStations.length;
    const trainsOnLine = 4; // Assume 4 trains are running on the line
    const averageSpeedKmH = 40; // Average speed of the train

    // Find the closest approaching train
    let minMinutes = Infinity;
    
    // Check trains moving forward
    for (let i = 0; i < trainsOnLine; i++) {
        const trainPosition = (Date.now() / 5000 + (totalStations / trainsOnLine) * i) % totalStations;
        if (trainPosition < targetStationIndex) {
            const distance = getDistance(stationCoords[line][lineStations[Math.floor(trainPosition)]], stationCoords[line][station]);
            const hours = distance / averageSpeedKmH;
            minMinutes = Math.min(minMinutes, hours * 60);
        }
    }
    
    const eta = minMinutes === Infinity ? "No trains approaching" : `${Math.max(1, Math.round(minMinutes))} mins`;
    res.json({ eta });
});


app.post("/api/predict", async (req, res) => {
  try {
    const { start_line, start_station, end_line, end_station, hour_of_day, day_of_week, is_holiday, crowd_level } = req.body;

    const startCoords = stationCoords[start_line]?.[start_station];
    const endCoords = stationCoords[end_line]?.[end_station];
    const distance_km = getDistance(startCoords, endCoords);
    const weatherData = await getWeather(startCoords[0], startCoords[1]);
    
    const mlResponse = await axios.post(ML_API_URL, {
      distance_km, hour_of_day, day_of_week, is_holiday, 
      weather_idx: weatherData.weather_idx,
      crowd_level,
    });

    const finalResponse = { ...mlResponse.data, weather: weatherData.status };
    res.json(finalResponse);

  } catch (error) {
    console.error("❌ Error in /api/predict:", error.message);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Tren-PH Backend server running at http://localhost:${PORT}`);
});