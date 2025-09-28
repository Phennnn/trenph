import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '../context/DataContext';
import { useAppContext } from '../context/AppContext';
import { FaTrain, FaRoute, FaClock, FaMapMarkerAlt, FaSun, FaCloudRain, FaWind } from 'react-icons/fa';
import { ArrowDownUp } from 'lucide-react';
import axios from 'axios';
import MapView from '../components/MapView';
import MapLegend from '../components/MapLegend';
import WeatherWidget from '../components/WeatherWidget';
import LiveClock from '../components/LiveClock';
import SearchableSelect from '../components/SearchableSelect'; // Import the new component

export default function Planner() {
  const transitData = useTransitData();
  const { userType, setUserType } = useAppContext();
  
  const [tripType, setTripType] = useState('stationToStation');
  const [startLine, setStartLine] = useState('LRT-1');
  const [startStation, setStartStation] = useState('');
  const [destinationLine, setDestinationLine] = useState('LRT-1');
  const [destinationStation, setDestinationStation] = useState('');
  const [destinationLandmark, setDestinationLandmark] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const lineOptions = React.useMemo(() => 
    Object.keys(transitData?.stations || {}).map(line => ({ value: line, label: transitData.stations[line].name })),
    [transitData?.stations]
  );

  const startStationOptions = React.useMemo(() => 
    (transitData?.stations?.[startLine]?.stations || []).map(station => ({ value: station, label: station })),
    [transitData?.stations, startLine]
  );
  
  const destinationStationOptions = React.useMemo(() => 
    (transitData?.stations?.[destinationLine]?.stations || []).map(station => ({ value: station, label: station })),
    [transitData?.stations, destinationLine]
  );
  
  const landmarkOptions = React.useMemo(() => 
    (transitData?.landmarks || []).map(landmark => ({ value: landmark.name, label: landmark.name })),
    [transitData?.landmarks]
  );

  useEffect(() => {
    if (transitData?.stations?.['LRT-1']?.stations.length) {
      setStartStation(transitData.stations['LRT-1'].stations[0]);
      setDestinationStation(transitData.stations['LRT-1'].stations[1]);
    }
    if (transitData?.landmarks?.length) {
      setDestinationLandmark(transitData.landmarks[0].name);
    }
  }, [transitData]);

  const handleReverseRoute = () => {
      if (tripType !== 'stationToStation') return;
      const tempStartLine = startLine;
      const tempStartStation = startStation;
      setStartLine(destinationLine);
      setStartStation(destinationStation);
      setDestinationLine(tempStartLine);
      setDestinationStation(tempStartStation);
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

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!transitData) return;
      setLoading(true);
      setPrediction(null);
      setRouteInfo(null);

      if (tripType === 'stationToLandmark') {
          try {
              const response = await axios.post('/api/multi-modal-route', {
                  start_line: startLine,
                  start_station: startStation,
                  destination_landmark: destinationLandmark,
              });
              setRouteInfo(response.data);
          } catch (error) {
              setRouteInfo({ route: "Could not find a multi-modal route.", fare: "N/A" });
          }
      } else {
          const startL = startLine;
          const startS = startStation;
          const destL = destinationLine;
          const destS = destinationStation;

          try {
            const response = await axios.post('/api/predict', {
                start_line: startL, start_station: startS, end_line: destL, end_station: destS,
                hour_of_day: new Date().getHours(),
                day_of_week: new Date().getDay(),
                is_holiday: 0,
            });
            setPrediction(response.data);
          } catch (error) {
            console.error("Prediction API error:", error);
            setPrediction({ weather: "Error", travelTime: "N/A" });
          }

          if (startL === destL) {
              const stationsTraveled = Math.abs(transitData.stations[startL].stations.indexOf(startS) - transitData.stations[startL].stations.indexOf(destS));
              const fare = calculateFare(stationsTraveled);
              const route = getRouteString(startL, startS, destS);
              setRouteInfo({ route: `(${transitData.stations[startL].name}) ${route}`, fare: fare });
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
            } else {
                setRouteInfo({ route: "No direct transfer route found.", fare: "N/A" });
            }
          }
      }
      setLoading(false);
  };
  
    const getWeatherIcon = (weatherStatus) => {
        if (!weatherStatus) return <FaSun />;
        if (weatherStatus.toLowerCase().includes('rain')) return <FaCloudRain />;
        if (weatherStatus.toLowerCase().includes('storm')) return <FaWind />;
        return <FaSun />;
    };
    const setupPlannerMap = useCallback((map) => {
        if (!transitData?.stations || !window.L) return;
        Object.keys(transitData.stations).forEach((line) => {
            const coords = transitData.stations[line].stations.map(s => transitData.stationCoords[line]?.[s]).filter(Boolean);
            if (coords.length > 1) {
                window.L.polyline(coords, { color: transitData.lineColors[line], weight: 5, opacity: 0.7 }).addTo(map);
            }
        });
    }, [transitData?.stations, transitData?.stationCoords, transitData?.lineColors]);


  if (!transitData?.stations || !transitData.operatingHours) {
    return <div className="flex h-full items-center justify-center"><h2>Loading Planner...</h2></div>;
  }

  return (
    <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.section initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl">
        <WeatherWidget />
        <div className="p-4 bg-gray-50 rounded-lg border mb-6">
            <LiveClock />
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Trip Type</label>
              <select value={tripType} onChange={(e) => setTripType(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md">
                <option value="stationToStation">Station to Station</option>
                <option value="stationToLandmark">Station to Landmark</option>
              </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Start Station</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                    <SearchableSelect options={lineOptions} value={startLine} onChange={value => { setStartLine(value); setStartStation(transitData.stations[value].stations[0]); }} />
                    <SearchableSelect options={startStationOptions} value={startStation} onChange={setStartStation} />
                </div>
            </div>
            
            <div className="flex justify-center my-2">
                <button type="button" onClick={handleReverseRoute} disabled={tripType !== 'stationToStation'} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ArrowDownUp className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {tripType === 'stationToStation' ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Destination Station</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <SearchableSelect options={lineOptions} value={destinationLine} onChange={value => { setDestinationLine(value); setDestinationStation(transitData.stations[value].stations[0]); }} />
                        <SearchableSelect options={destinationStationOptions} value={destinationStation} onChange={setDestinationStation} />
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Destination Landmark</label>
                    <div className="mt-1">
                      <SearchableSelect options={landmarkOptions} value={destinationLandmark} onChange={setDestinationLandmark} />
                    </div>
                </div>
            )}

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