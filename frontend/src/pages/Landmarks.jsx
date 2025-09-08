import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '../context/DataContext';
import { FaLandmark, FaExternalLinkAlt } from 'react-icons/fa';
import MapView from '../components/MapView'; // Assuming you have a generic MapView component

export default function Landmarks() {
  const transitData = useTransitData();
  const mapRef = useRef(null);

  const handleLandmarkClick = (coords) => {
    // This logic assumes your MapView component can be controlled via a ref
    if (mapRef.current && mapRef.current.getMap) {
      const map = mapRef.current.getMap();
      map.setView(coords, 15);
    }
  };
  
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
          <MapView ref={mapRef} transitData={transitData} showLandmarks={true} showStations={true} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* --- THIS IS THE FIX --- */}
          {/* We check if transitData and transitData.landmarks exist before trying to map them */}
          {transitData?.landmarks && transitData.landmarks.map((landmark, index) => (
            <motion.div 
              key={landmark.name} 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: index * 0.05 }} 
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} 
              className="p-4 border rounded-lg cursor-pointer bg-gray-50 overflow-hidden" 
              onClick={() => handleLandmarkClick(landmark.coords)}
            >
              <img src={landmark.imageUrl} alt={landmark.name} className="w-full h-32 object-cover rounded-md mb-3" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Not+Found'; }} />
              <h3 className="font-bold text-purple-700">{landmark.name}</h3>
              <p className="text-sm text-gray-600">{landmark.type}</p>
              <a 
                href={`https://www.google.com/maps?q=${landmark.coords[0]},${landmark.coords[1]}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-purple-600 hover:underline mt-2 inline-flex items-center"
                onClick={(e) => e.stopPropagation()} // Prevents card click when link is clicked
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

