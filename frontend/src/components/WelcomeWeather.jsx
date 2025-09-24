import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaCloudRain, FaWind, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WelcomeWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('/api/weather');
        setWeather(response.data);
      } catch (error) {
        console.error("Failed to fetch weather", error);
        setWeather({ status: 'Weather data unavailable', temp: '' });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = () => {
    if (!weather || !weather.status) return <FaSun />;
    const status = weather.status.toLowerCase();
    if (status.includes('rain') || status.includes('drizzle')) return <FaCloudRain />;
    if (status.includes('storm') || status.includes('thunder')) return <FaWind />;
    return <FaSun />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-white/80">
        <FaSpinner className="animate-spin" />
        <span>Loading current weather...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/20 mb-12 flex items-center justify-center gap-4"
    >
      {getWeatherIcon()}
      <p className="text-xl">
        {weather.status} in Metro Manila, {weather.temp}
      </p>
    </motion.div>
  );
};

export default WelcomeWeather;