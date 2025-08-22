import { useState } from "react";
import axios from "axios";

export default function PredictForm() {
  const [formData, setFormData] = useState({
    distance_km: "",
    hour_of_day: "",
    day_of_week: "",
    is_holiday: 0,
    weather_idx: 1,
    crowd_level: 0.5,
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/predict", {
        ...formData,
        distance_km: parseFloat(formData.distance_km),
        hour_of_day: parseInt(formData.hour_of_day),
        day_of_week: parseInt(formData.day_of_week),
        is_holiday: parseInt(formData.is_holiday),
        weather_idx: parseInt(formData.weather_idx),
        crowd_level: parseFloat(formData.crowd_level),
      });
      setPrediction(res.data.predicted_travel_time_minutes);
    } catch (error) {
      console.error(error);
      alert("Prediction failed!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Predict Your Travel Time
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="distance_km"
          type="number"
          placeholder="Distance in KM"
          value={formData.distance_km}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          name="hour_of_day"
          type="number"
          placeholder="Hour of Day (0-23)"
          value={formData.hour_of_day}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          name="day_of_week"
          type="number"
          placeholder="Day of Week (0=Sunday)"
          value={formData.day_of_week}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <select
          name="is_holiday"
          value={formData.is_holiday}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value={0}>Not Holiday</option>
          <option value={1}>Holiday</option>
        </select>
        <input
          name="weather_idx"
          type="number"
          placeholder="Weather Index"
          value={formData.weather_idx}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          name="crowd_level"
          type="number"
          step="0.1"
          placeholder="Crowd Level (0.0 - 1.0)"
          value={formData.crowd_level}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg w-full hover:bg-secondary transition"
        >
          Predict
        </button>
      </form>
      {prediction && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
          <strong>Predicted Travel Time:</strong> {prediction.toFixed(2)} minutes
        </div>
      )}
    </div>
  );
}
