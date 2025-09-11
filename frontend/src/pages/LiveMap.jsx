import React, { useEffect, useState, useRef } from 'react';
import { useTransitData } from '../context/DataContext';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Marker, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';

// A custom component to animate a train along a path
const AnimatedTrain = ({ line, positions, color }) => {
  const map = useMap();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(positions[0]);
  const markerRef = useRef(null);
  
  // Create a custom pulsing icon for the train
  const trainIcon = L.divIcon({
    className: 'custom-train-icon',
    html: `<div style="background-color:${color};" class="pulsing-dot"></div>`,
    iconSize: [12, 12],
  });

  useEffect(() => {
    let animationFrameId;
    let startTime = Date.now();
    const duration = 2000; // Time in ms to travel between stations

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      let progress = elapsedTime / duration;

      if (progress < 1) {
        const startPoint = L.latLng(positions[currentIndex]);
        const endPoint = L.latLng(positions[currentIndex + 1]);
        const newPos = L.latLng(
          startPoint.lat + (endPoint.lat - startPoint.lat) * progress,
          startPoint.lng + (endPoint.lng - startPoint.lng) * progress
        );
        setMarkerPosition(newPos);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Move to the next segment of the line
        const nextIndex = (currentIndex + 1) % (positions.length - 1);
        setCurrentIndex(nextIndex);
        startTime = Date.now(); // Reset start time for the new segment
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [currentIndex, positions]);
  
  // This effect makes the train marker smoothly pan on the map
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(markerPosition);
    }
  }, [markerPosition]);

  return <Marker ref={markerRef} position={markerPosition} icon={trainIcon} />;
};


export default function LiveMap() {
  const { stations, stationCoords, lineColors } = useTransitData();

  if (!stations || !stationCoords || !lineColors) {
    return <div className="p-4 text-center">Loading Map Data...</div>;
  }

  const mapCenter = [14.5995, 120.9842]; // Metro Manila Center

  return (
    <main className="max-w-7xl mx-auto p-4">
      {/* Add CSS for the pulsing train icon */}
      <style>{`
        .custom-train-icon .pulsing-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 5px #333;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Live Transit Map</h2>
        <div className="h-[75vh] w-full rounded-lg overflow-hidden border">
          <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {Object.keys(stations).map(line => {
              const positions = stations[line].stations
                .map(station => stationCoords[line]?.[station])
                .filter(Boolean);
              
              if (positions.length < 2) return null;

              return (
                <React.Fragment key={line}>
                  {/* Draw the static train line */}
                  <Polyline positions={positions} color={lineColors[line]} weight={4} opacity={0.7} />
                  
                  {/* Add an animated train for this line */}
                  <AnimatedTrain line={line} positions={positions} color={lineColors[line]} />
                </React.Fragment>
              );
            })}

            {/* Draw the station markers */}
            {Object.keys(stations).map(line => 
              stations[line].stations.map(station => {
                const position = stationCoords[line]?.[station];
                if (!position) return null;
                return (
                  <CircleMarker key={`${line}-${station}`} center={position} radius={5} pathOptions={{ color: lineColors[line], fillColor: '#fff', fillOpacity: 1, weight: 2 }}>
                    <Popup>{station} ({stations[line].name})</Popup>
                  </CircleMarker>
                );
              })
            )}
          </MapContainer>
        </div>
      </motion.div>
    </main>
  );
}