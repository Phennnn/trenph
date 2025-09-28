const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware');

const app = express();
const PORT = 3000;
const ML_API_URL = "http://1227.0.0.1:5001/predict";
const WEATHER_API_KEY = process.env.WEATHERAPI_KEY;

// --- Load All Necessary Data ---
let stationCoords = {}, stations = {}, crowdProfiles = {}, operatingHours = {}, landmarks = {}, connections = {};
try {
    const load = (p) => JSON.parse(fs.readFileSync(path.resolve(__dirname, p)));
    stationCoords = load('../frontend/src/data/station_coords.json');
    stations = load('../frontend/src/data/stations.json');
    crowdProfiles = load('../ml/data/station_crowd_profiles.json');
    operatingHours = load('../frontend/src/data/operating_hours.json');
    landmarks = load('../frontend/src/data/landmarks.json');
    connections = load('../frontend/src/data/connections.json');
    console.log("🚉 Successfully loaded all data files.");
} catch (error) {
    console.error("❌ Error loading data files:", error);
}

// --- Middleware & Helpers ---
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Helper functions are at the bottom of the file

// --- API Routes ---
app.get("/", (req, res) => res.send("🚄 Tren-PH Backend is running!"));

// --- User Authentication Routes ---
app.post('/api/register', async (req, res) => { /* ... same as before ... */ });
app.post('/api/login', async (req, res) => { /* ... same as before ... */ });

// --- Trip and History Routes ---
app.get('/api/trips', auth, async (req, res) => { /* ... same as before ... */ });
app.post('/api/trips', auth, async (req, res) => { /* ... same as before ... */ });

// --- NEW: Service Advisories Route ---
app.get('/api/advisories', async (req, res) => {
    try {
        const advisories = await db.query("SELECT * FROM advisories ORDER BY created_at DESC");
        res.json(advisories.rows);
    } catch (err) {
        console.error("Error fetching advisories:", err.message);
        res.status(500).send('Server Error');
    }
});


// Other existing routes are at the bottom

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Tren-PH Backend server running at http://localhost:${PORT}`);
});


// --- Full Helper and Existing Route Functions ---
function getDistance(coord1, coord2) { /* ... same as before ... */ }
async function getWeather(lat, lon) { /* ... same as before ... */ }
function getCrowdLevel(line, station, hour) { /* ... same as before ... */ }
function isServiceRunning(line) { /* ... same as before ... */ }
app.get("/api/weather", async (req, res) => { /* ... same as before ... */ });
app.post("/api/eta", (req, res) => { /* ... same as before ... */ });
app.post("/api/multi-modal-route", (req, res) => { /* ... same as before ... */ });
app.post("/api/predict", async (req, res) => { /* ... same as before ... */ });