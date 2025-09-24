import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaCloudRain, FaWind, FaSpinner } from 'react-icons/fa';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('/api/weather');
        setWeather(response.data);
      } catch (error) {
        console.error("Failed to fetch weather", error);
        setWeather({ status: 'Error', temp: 'N/A' });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = () => {
    if (!weather || !weather.status) return <FaSun className="text-yellow-500" />;
    const status = weather.status.toLowerCase();
    if (status.includes('rain') || status.includes('drizzle')) return <FaCloudRain className="text-blue-500" />;
    if (status.includes('storm') || status.includes('thunder')) return <FaWind className="text-gray-600" />;
    return <FaSun className="text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border mb-6 flex items-center justify-center gap-3">
        <FaSpinner className="animate-spin" />
        <span className="text-gray-600">Loading Weather...</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {getWeatherIcon()}
          <div>
            <p className="font-bold text-lg text-gray-800">{weather.status}</p>
            <p className="text-sm text-gray-500">Metro Manila</p>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{weather.temp}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;