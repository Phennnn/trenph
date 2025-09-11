import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '../context/DataContext';
import { FaLandmark, FaExternalLinkAlt } from 'react-icons/fa';
import MapView from '../components/MapView';
import MapLegend from '../components/MapLegend'; // <-- LEGEND IMPORTED

export default function Landmarks() {
  const { landmarks, stations, stationCoords, lineColors, pwdFriendly, operatingHours } = useTransitData();

  const setupLandmarksMap = useCallback((map) => {
    if (!landmarks || !stations || !window.L) return;

    landmarks.forEach(landmark => {
      window.L.marker(landmark.coords).addTo(map).bindPopup(`<b>${landmark.name}</b><br>${landmark.type}`);
    });

    Object.keys(stations).forEach(line => {
      stations[line].stations.forEach(station => {
        const coords = stationCoords[line]?.[station];
        if (coords) {
          const isPwd = pwdFriendly[line]?.includes(station);
          const stationIcon = window.L.divIcon({
            className: 'station-marker',
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="${lineColors[line]}" width="20" height="20" style="filter: drop-shadow(0 0 2px black);"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 0 1-35.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>`,
            iconSize: [20, 20],
            iconAnchor: [10, 20]
          });
          window.L.marker(coords, { icon: stationIcon }).addTo(map).bindPopup(`<b>${station}</b><br>${stations[line].name}<br>${isPwd ? '<span style="color: green;">✓ PWD Accessible</span>' : ''}<hr class="my-1">Hours: ${operatingHours[line]}`);
        }
      });
    });
  }, [landmarks, stations, stationCoords, lineColors, pwdFriendly, operatingHours]);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="bg-white p-6 rounded-lg shadow-xl relative"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
          <FaLandmark /> <span className="ml-2">Explore Landmarks & Stations</span>
        </h2>
        <div className="relative w-full h-[500px] rounded-lg overflow-hidden mb-6">
          <MapView 
            center={[14.58, 120.98]}
            zoom={13}
            setupMap={setupLandmarksMap} 
          />
          <MapLegend />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {landmarks?.map((landmark, index) => (
            <motion.div 
              key={landmark.name} 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: index * 0.05 }} 
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} 
              className="p-4 border rounded-lg cursor-pointer bg-gray-50 overflow-hidden" 
            >
              <img src={landmark.imageUrl} alt={landmark.name} className="w-full h-32 object-cover rounded-md mb-3" />
              <h3 className="font-bold text-purple-700">{landmark.name}</h3>
              <p className="text-sm text-gray-600">{landmark.type}</p>
              <a 
                href={`https://maps.google.com/?q=${landmark.coords[0]},${landmark.coords[1]}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-purple-600 hover:underline mt-2 inline-flex items-center"
                onClick={(e) => e.stopPropagation()} 
              >
                View on Google Maps <FaExternalLinkAlt className="ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}