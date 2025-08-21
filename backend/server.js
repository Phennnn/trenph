// backend/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 3000;
const ML_API_URL = "http://127.0.0.1:5001/predict"; // Flask ML API

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => {
  res.send("🚄 Tren-PH Backend is running!");
});

// Predict Route
app.post("/api/predict", async (req, res) => {
  try {
    const { distance_km, hour_of_day, day_of_week, is_holiday, weather_idx, crowd_level } = req.body;

    // ✅ Input validation
    if (
      typeof distance_km !== "number" || distance_km <= 0 ||
      typeof hour_of_day !== "number" || hour_of_day < 0 || hour_of_day > 23 ||
      typeof day_of_week !== "number" || day_of_week < 0 || day_of_week > 6 ||
      typeof is_holiday !== "number" || ![0, 1].includes(is_holiday) ||
      typeof weather_idx !== "number" ||
      typeof crowd_level !== "number" || crowd_level < 0 || crowd_level > 1
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // ✅ Send request to ML API
    const response = await axios.post(ML_API_URL, {
      distance_km,
      hour_of_day,
      day_of_week,
      is_holiday,
      weather_idx,
      crowd_level,
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error communicating with ML API:", error.message);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tren-PH Backend server running at http://localhost:${PORT}`);
});
