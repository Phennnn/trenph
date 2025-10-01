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
const ML_API_URL = "http://127.0.0.1:5001/predict";
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

// --- Middleware ---
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// --- API Routes ---
app.get("/", (req, res) => res.send("🚄 Tren-PH Backend is running!"));

// --- User Authentication Routes ---
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const newUser = await db.query( "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email", [email, password_hash] );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error("Registration error:", err.message);
        if (err.code === '23505') {
            return res.status(400).json({ error: "Email already in use." });
        }
        res.status(500).json({ error: "Server error during registration." });
    }
});
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials." });
        }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, "yourSecretKey", { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).send("Server error");
    }
});

// --- Trip and History Routes ---
app.get('/api/trips', auth, async (req, res) => {
    try {
        const trips = await db.query("SELECT * FROM trips WHERE user_id = $1 ORDER BY trip_date DESC", [req.user.id]);
        res.json(trips.rows);
    } catch (err) {
        console.error("Error fetching trips:", err.message);
        res.status(500).send('Server Error');
    }
});
app.post('/api/trips', auth, async (req, res) => {
    const { origin, destination, mode, duration, cost, distance } = req.body;
    try {
        const newTrip = await db.query(
            "INSERT INTO trips (user_id, origin, destination, mode, duration, cost, distance) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [req.user.id, origin, destination, mode, duration, cost, distance]
        );
        res.json(newTrip.rows[0]);
    } catch (err) {
        console.error("Error saving trip:", err.message);
        res.status(500).send('Server Error');
    }
});

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

// --- Existing Feature API Routes ---
function getDistance(coord1, coord2) { if (!coord1 || !coord2) return 0; const R = 6371; const dLat = (coord2[0] - coord1[0]) * Math.PI / 180; const dLon = (coord2[1] - coord1[1]) * Math.PI / 180; const a = 0.5 - Math.cos(dLat) / 2 + Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * (1 - Math.cos(dLon)) / 2; return R * 2 * Math.asin(Math.sqrt(a)); }
async function getWeather(lat, lon) { if (!WEATHER_API_KEY) { console.warn("⚠️ No WeatherAPI key found. Defaulting to 'Clear' weather."); return { weather_idx: 1, status: "API Key Missing", temp: "N/A" }; } try { const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`; const response = await axios.get(url, { timeout: 5000 }); const { condition, temp_c } = response.data.current; let weather_idx = 1; if ([1063, 1072, 1087, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246, 1273, 1276].includes(condition.code)) weather_idx = 2; else if (condition.code >= 1198 || (condition.code >= 1114 && condition.code <= 1117)) weather_idx = 3; return { weather_idx, status: condition.text, temp: `${temp_c}°C` }; } catch (error) { console.error("❌ Error fetching weather data:", error.message); return { weather_idx: 1, status: "Error", temp: "N/A" }; } }
function getCrowdLevel(line, station, hour) { try { const max_riders_assumed = 6000; const hourly_riders = crowdProfiles[line]?.[station]?.[hour.toString()] || 500; return Math.min(hourly_riders / max_riders_assumed, 1.0); } catch (error) { return 0.5; } }
function isServiceRunning(line) { const hours = operatingHours[line]; if (!hours) return false; const [startStr, endStr] = hours.split(' - '); const now = new Date(); const currentMinutes = now.getHours() * 60 + now.getMinutes(); const parseTime = (timeStr) => { let [time, modifier] = timeStr.split(' '); let [h, m] = time.split(':').map(Number); if (modifier === 'PM' && h !== 12) h += 12; if (modifier === 'AM' && h === 12) h = 0; return h * 60 + m; }; const startMinutes = parseTime(startStr); const endMinutes = parseTime(endStr); return currentMinutes >= startMinutes && currentMinutes <= endMinutes; }
app.get("/api/weather", async (req, res) => { try { const weatherData = await getWeather(14.5995, 120.9842); res.json(weatherData); } catch (error) { res.status(500).json({ error: "Failed to fetch weather data." }); } });
app.post("/api/eta", (req, res) => { const { line, station } = req.body; if (!line || !station || !stations[line]) return res.status(400).json({ error: "Invalid line or station." }); if (!isServiceRunning(line)) { return res.json({ eta: "Service Closed" }); } const lineStations = stations[line].stations; const targetStationIndex = lineStations.indexOf(station); const targetStationCoords = stationCoords[line]?.[station]; if (targetStationIndex === -1) return res.status(400).json({ error: "Station not found on line." }); const totalStations = lineStations.length; const trainsOnLine = 4; const averageSpeedKmH = 40; let minMinutes = Infinity; for (let i = 0; i < trainsOnLine; i++) { const trainProgress = (Date.now() / 5000 + (totalStations / trainsOnLine) * i) % totalStations; const trainIndex = Math.floor(trainProgress); if (trainIndex < targetStationIndex) { const distance = getDistance(stationCoords[line][lineStations[trainIndex]], targetStationCoords); minMinutes = Math.min(minMinutes, (distance / averageSpeedKmH) * 60); } } for (let i = 0; i < trainsOnLine; i++) { const trainProgress = (totalStations - ((Date.now() / 5000 + (totalStations / trainsOnLine) * i) % totalStations)); const trainIndex = Math.floor(trainProgress); if (trainIndex > targetStationIndex && trainIndex < totalStations) { const distance = getDistance(stationCoords[line][lineStations[trainIndex]], targetStationCoords); minMinutes = Math.min(minMinutes, (distance / averageSpeedKmH) * 60); } } const eta = minMinutes === Infinity ? "No trains approaching" : `${Math.max(1, Math.round(minMinutes))} mins`; res.json({ eta }); });
app.post("/api/multi-modal-route", (req, res) => { const { start_line, start_station, destination_landmark } = req.body; const landmark = landmarks.find(l => l.name === destination_landmark); if (!landmark) { return res.status(404).json({ error: "Landmark not found" }); } let closestStation = { name: null, line: null, distance: Infinity }; for (const line in stationCoords) { for (const station in stationCoords[line]) { const distance = getDistance(landmark.coords, stationCoords[line][station]); if (distance < closestStation.distance) { closestStation = { name: station, line: line, distance: distance }; } } } const trainRoute = `Take ${stations[start_line].name} from ${start_station} to ${closestStation.name}.`; const finalLeg = connections.find(c => c.destination.includes(landmark.name.split(' ')[0])) || connections[2]; const connectionRoute = `From ${closestStation.name}, walk for ${finalLeg.walkingTime} min and take the ${finalLeg.name} to ${finalLeg.destination}.`; const fullRoute = `1. ${trainRoute}\n2. ${connectionRoute}`; const totalFare = 20 + finalLeg.fare; res.json({ route: fullRoute, fare: totalFare }); });
app.post("/api/predict", async (req, res) => { try { const { start_line, start_station, end_line, end_station, hour_of_day, day_of_week, is_holiday } = req.body; const startCoords = stationCoords[start_line]?.[start_station]; const endCoords = stationCoords[end_line]?.[end_station]; const distance_km = getDistance(startCoords, endCoords); const weatherData = await getWeather(startCoords[0], startCoords[1]); const crowd_level = getCrowdLevel(start_line, start_station, hour_of_day); const mlResponse = await axios.post(ML_API_URL, { distance_km, hour_of_day, day_of_week, is_holiday, weather_idx: weatherData.weather_idx, crowd_level, }); const finalResponse = { ...mlResponse.data, weather: weatherData.status }; res.json(finalResponse); } catch (error) { console.error("❌ Error in /api/predict:", error.message); res.status(500).json({ error: "Server error. Try again later." }); } });

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Tren-PH Backend server running at http://localhost:${PORT}`);
});