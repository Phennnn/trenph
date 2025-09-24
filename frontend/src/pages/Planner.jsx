import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '../context/DataContext';
import { useAppContext } from '../context/AppContext';
import { FaTrain, FaRoute, FaClock, FaMapMarkerAlt, FaSun, FaCloudRain, FaWind } from 'react-icons/fa';
import axios from 'axios';
import MapView from '../components/MapView';
import MapLegend from '../components/MapLegend';
import WeatherWidget from '../components/WeatherWidget';
import LiveClock from '../components/LiveClock'; // Import the new LiveClock component

export default function Planner() {
  const transitData = useTransitData();
  const { userType, setUserType } = useAppContext();
  
  // The currentTime state and its useEffect have been removed from here
  
  const [startLine, setStartLine] = useState('LRT-1');
  const [startStation, setStartStation] = useState('');
  const [destinationLine, setDestinationLine] = useState('LRT-1');
  const [destinationStation, setDestinationStation] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transitData?.stations?.['LRT-1']?.stations) {
      setStartStation(transitData.stations['LRT-1'].stations[0]);
      setDestinationStation(transitData.stations['LRT-1'].stations[1]);
    }
  }, [transitData]);

  const fetchPrediction = async (stationsTraveled, startLine, startStation, endLine, endStation) => {
    try {
        const mlData = {
            start_line: startLine,
            start_station: startStation,
            end_line: endLine,
            end_station: endStation,
            hour_of_day: new Date().getHours(),
            day_of_week: new Date().getDay(),
            is_holiday: 0,
            crowd_level: 0.5,
        };
        const response = await axios.post('/api/predict', mlData);
        setPrediction(response.data);
    } catch (error) {
        console.error('Prediction error:', error);
        setPrediction({ eta: 'N/A', status: 'Unavailable', travelTime: 'N/A', weather: 'Unknown' });
    }
  };

  const calculateFare = (stationsTraveled) => {
      if (!transitData?.fareMatrix || stationsTraveled <= 0) return 0;
      const fareBracket = transitData.fareMatrix[stationsTraveled] || transitData.fareMatrix[19];
      const fareIndex = (userType === 'Regular' || userType === 'Student') ? 0 : 1;
      return fareBracket ? fareBracket[fareIndex] : 0;
  };

  const getRouteString = (line, start, end) => {
      if (!transitData?.stations) return "";
      const lineStations = transitData.stations[line]?.stations;
      if (!lineStations) return "Invalid line";
      const startIndex = lineStations.indexOf(start);
      const destIndex = lineStations.indexOf(end);
      if (startIndex === -1 || destIndex === -1) return "Invalid station";
      const routeStations = lineStations.slice(Math.min(startIndex, destIndex), Math.max(startIndex, destIndex) + 1);
      if (startIndex > destIndex) routeStations.reverse();
      return routeStations.join(' → ');
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      if (!transitData) return;
      setLoading(true);
      setPrediction(null);
      setRouteInfo(null);

      const startL = startLine;
      const startS = startStation;
      const destL = destinationLine;
      const destS = destinationStation;

      if (startL === destL) {
          const stationsTraveled = Math.abs(transitData.stations[startL].stations.indexOf(startS) - transitData.stations[startL].stations.indexOf(destS));
          if (stationsTraveled === 0) {
              setRouteInfo({ route: "Start and destination cannot be the same.", fare: "N/A" });
              setLoading(false); return;
          }
          const fare = calculateFare(stationsTraveled);
          const route = getRouteString(startL, startS, destS);
          setRouteInfo({ route: `(${transitData.stations[startL].name}) ${route}`, fare: fare });
          fetchPrediction(stationsTraveled, startL, startS, destL, destS);
      } else {
          const startInterchanges = transitData.interchanges[startL];
          let bestRoute = null;
          if (startInterchanges) {
              for (const interchangeStation in startInterchanges) {
                  const connection = startInterchanges[interchangeStation];
                  if (connection.line === destL) {
                      const leg1 = Math.abs(transitData.stations[startL].stations.indexOf(startS) - transitData.stations[startL].stations.indexOf(interchangeStation));
                      const leg2 = Math.abs(transitData.stations[destL].stations.indexOf(connection.station) - transitData.stations[destL].stations.indexOf(destS));
                      const total = leg1 + leg2;
                      if (!bestRoute || total < bestRoute.totalStations) {
                          bestRoute = { totalStations: total, interchange: interchangeStation, connection: connection.station, leg1_fare: calculateFare(leg1), leg2_fare: calculateFare(leg2) };
                      }
                  }
              }
          }
          if (bestRoute) {
              const fullRoute = `(${transitData.stations[startL].name}) ${getRouteString(startL, startS, bestRoute.interchange)} \n➡️ TRANSFER AT ${bestRoute.interchange}/${bestRoute.connection} ➡️\n (${transitData.stations[destL].name}) ${getRouteString(destL, bestRoute.connection, destS)}`;
              setRouteInfo({ route: fullRoute, fare: bestRoute.leg1_fare + bestRoute.leg2_fare });
              fetchPrediction(bestRoute.totalStations, startL, startS, destL, destS);
          } else {
              setRouteInfo({ route: "No direct transfer route found.", fare: "N/A" });
          }
      }
      setLoading(false);
  };
  
  const setupPlannerMap = useCallback((map) => {
    if (!transitData?.stations || !window.L) return;
    Object.keys(transitData.stations).forEach((line) => {
        const coords = transitData.stations[line].stations.map(s => transitData.stationCoords[line]?.[s]).filter(Boolean);
        if (coords.length > 1) {
            window.L.polyline(coords, { color: transitData.lineColors[line], weight: 5, opacity: 0.7 }).addTo(map);
        }
    });
  }, [transitData]);

  const getWeatherIcon = (weatherStatus) => {
      if (!weatherStatus) return <FaSun />;
      if (weatherStatus.toLowerCase().includes('rain')) return <FaCloudRain />;
      if (weatherStatus.toLowerCase().includes('storm')) return <FaWind />;
      return <FaSun />;
  };


  if (!transitData?.stations || !transitData.operatingHours || !startStation) {
    return <div className="flex h-full items-center justify-center"><h2>Loading Planner...</h2></div>;
  }

  return (
    <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.section initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl">
        <WeatherWidget />
        <div className="p-4 bg-gray-50 rounded-lg border mb-6">
            <LiveClock /> {/* <-- Use the new LiveClock component */}
            <hr className="my-2"/>
            <div className="text-xs text-gray-600 space-y-1">
                {Object.keys(transitData.operatingHours).map(line => (
                    <div key={line} className="flex justify-between">
                        <span>{transitData.stations[line]?.name}:</span>
                        <span>{transitData.operatingHours[line]}</span>
                    </div>
                ))}
            </div>
        </div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800"><FaTrain /> <span className="ml-2">Plan Your Journey</span></h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* The form remains unchanged */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Start Line</label>
                <select value={startLine} onChange={(e) => { setStartLine(e.target.value); setStartStation(transitData.stations[e.target.value].stations[0]); }} className="mt-1 block w-full p-3 border border-gray-300 rounded-md">{Object.keys(transitData.stations).map((line) => (<option key={line} value={line}>{transitData.stations[line].name}</option>))}</select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Start Station</label>
                <select value={startStation} onChange={(e) => setStartStation(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md">{transitData.stations[startLine].stations.map((station) => (<option key={station} value={station}>{station}</option>))}</select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Destination Line</label>
                <select value={destinationLine} onChange={(e) => { setDestinationLine(e.target.value); setDestinationStation(transitData.stations[e.target.value].stations[0]); }} className="mt-1 block w-full p-3 border border-gray-300 rounded-md">{Object.keys(transitData.stations).map((line) => (<option key={line} value={line}>{transitData.stations[line].name}</option>))}</select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Destination Station</label>
                <select value={destinationStation} onChange={(e) => setDestinationStation(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md">{transitData.stations[destinationLine].stations.map((station) => (<option key={station} value={station}>{station}</option>))}</select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md">
                    <option value="Regular">Regular</option>
                    <option value="Student">Student</option>
                    <option value="PWD">Senior / PWD</option>
                </select>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                 <button type="submit" disabled={loading} className="w-full py-3 mt-2 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400">{loading ? 'Calculating...' : 'Calculate & Predict'}</button>
            </motion.div>
        </form>
        {routeInfo && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-gray-50/90 rounded-lg border whitespace-pre-line">
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800"><FaRoute /> <span className="ml-2">Your Trip Details</span></h3>
                <p className="text-sm"><strong>Route:</strong> {routeInfo.route}</p>
                <p className="text-lg font-bold"><strong>Fare ({userType}):</strong> <span className="text-purple-600">PHP {routeInfo.fare}</span></p>
            </motion.section>
        )}
        {prediction && (
             <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-gray-50/90 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800"><FaClock /> <span className="ml-2">Live Prediction</span></h3>
                <p className="flex items-center gap-2"><strong>Weather:</strong> {getWeatherIcon(prediction.weather)} {prediction.weather || 'Clear'}</p>
                <p><strong>Travel Time:</strong> {prediction.travelTime || 'N/A'}</p>
            </motion.section>
        )}
      </motion.section>
      <motion.section initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl relative h-[500px] lg:h-auto">
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800"><FaMapMarkerAlt /> <span className="ml-2">Transit Map</span></h2>
        <div className="relative w-full h-[calc(100%-4rem)] rounded-lg overflow-hidden">
          <MapView center={[14.5995, 120.9842]} zoom={12} setupMap={setupPlannerMap} />
          <MapLegend />
        </div>
      </motion.section>
    </main>
  );
}