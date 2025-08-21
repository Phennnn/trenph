// src/App.js
import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    distance_km: "",
    hour_of_day: "",
    day_of_week: "",
    is_holiday: 0,
    weather_idx: 0,
    crowd_level: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distance_km: Number(form.distance_km),
          hour_of_day: Number(form.hour_of_day),
          day_of_week: Number(form.day_of_week),
          is_holiday: Number(form.is_holiday),
          weather_idx: Number(form.weather_idx),
          crowd_level: Number(form.crowd_level),
        }),
      });
      const data = await response.json();
      setResult(data.predicted_travel_time_minutes);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚄 Tren-PH Travel Time Predictor</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" name="distance_km" placeholder="Distance (km)" onChange={handleChange} /><br />
        <input type="number" name="hour_of_day" placeholder="Hour of Day (0-23)" onChange={handleChange} /><br />
        <input type="number" name="day_of_week" placeholder="Day of Week (0=Sun)" onChange={handleChange} /><br />
        <select name="is_holiday" onChange={handleChange}>
          <option value="0">Not Holiday</option>
          <option value="1">Holiday</option>
        </select><br />
        <input type="number" name="weather_idx" placeholder="Weather Index" onChange={handleChange} /><br />
        <input type="number" step="0.1" name="crowd_level" placeholder="Crowd Level (0-1)" onChange={handleChange} /><br />
        <button type="submit">Predict</button>
      </form>

      {result && (
        <h2>🕒 Estimated Travel Time: {result.toFixed(2)} minutes</h2>
      )}
    </div>
  );
}

export default App;
