import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrain, FaMapMarkerAlt, FaNewspaper } from 'react-icons/fa';
import axios from 'axios';

function Dashboard() {
  const [selectedLine, setSelectedLine] = useState('LRT');
  const [predictions, setPredictions] = useState([]);
  const [news, setNews] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const stations = {
    LRT: ['Baclaran', 'EDSA', 'Libertad'],
    MRT: ['North Avenue', 'Quezon Avenue', 'GMA Kamuning'],
    PNR: ['Tutuban', 'Blumentritt', 'España'],
  };

  const fetchPredictions = async (line) => {
    try {
      const response = await axios.get(`/api/predictions?line=${line}`);
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const fetchNews = async (line) => {
    try {
      const response = await axios.get(`/api/news?line=${line}`);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  };

  const handleLineChange = (line) => {
    setSelectedLine(line);
    fetchPredictions(line);
    fetchNews(line);
    getUserLocation();
  };

  return (
    <div className="min-h-screen bg-cosmic text-white flex flex-col items-center p-4">
      {/* Header with Line Selection */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-cyan-400">Tren.ph</h1>
        <select
          value={selectedLine}
          onChange={(e) => handleLineChange(e.target.value)}
          className="mt-4 md:mt-0 p-2 bg-cosmic border border-cyan-400 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="LRT">LRT</option>
          <option value="MRT">MRT</option>
          <option value="PNR">PNR</option>
        </select>
      </motion.header>

      {/* Main Content - Responsive Grid */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Station List & Predictions */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gray-800 rounded-lg shadow-neon-cyan"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaTrain className="mr-2 text-cyan-400" /> {selectedLine} Stations & Predictions
          </h2>
          <ul className="space-y-2">
            {stations[selectedLine].map((station, index) => (
              <li key={index} className="flex justify-between">
                <span>{station}</span>
                <span className="text-pink-500">
                  {predictions[index] ? `ETA: ${predictions[index].eta} min` : 'Loading...'}
                </span>
              </li>
            ))}
          </ul>

          {/* Crowdsourcing Input */}
          <form className="mt-4">
            <input
              type="text"
              placeholder="Report train at station..."
              className="w-full p-2 bg-cosmic border border-purple-500 rounded text-white"
            />
            <button type="submit" className="mt-2 w-full p-2 bg-purple-500 rounded hover:bg-purple-600">
              Submit Sighting
            </button>
          </form>
        </motion.section>

        {/* Google Maps Integration */}
        <section className="p-4 bg-gray-800 rounded-lg shadow-neon-pink">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-pink-500" /> Nearby Stations
          </h2>
          {userLocation ? (
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1690000000000`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded"
            ></iframe>
          ) : (
            <p>Enable location to see nearby {selectedLine} stations.</p>
          )}
        </section>

        {/* News Aggregation */}
        <section className="p-4 bg-gray-800 rounded-lg shadow-neon-purple">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaNewspaper className="mr-2 text-purple-500" /> Latest News
          </h2>
          <ul className="space-y-2">
            {news.map((item, index) => (
              <li key={index} className="text-sm">
                {item.title} - {item.date}
              </li>
            ))}
            {!news.length && <p>Loading news for {selectedLine}...</p>}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
