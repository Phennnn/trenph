import React, { useEffect, useState, useRef } from 'react';
import { useTransitData } from '../context/DataContext';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Marker, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Train, Clock } from 'lucide-react';

// A custom component to animate a train along a path
const AnimatedTrain = ({ line, positions, color }) => {
  const map = useMap();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(positions[0]);
  const markerRef = useRef(null);
  
  const trainIcon = L.divIcon({
    className: 'custom-train-icon',
    html: `<div style="background-color:${color};" class="pulsing-dot"></div>`,
    iconSize: [12, 12],
  });

  useEffect(() => {
    let animationFrameId;
    let startTime = Date.now();
    const duration = 5000; // Time in ms to travel between stations

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
        const nextIndex = (currentIndex + 1) % (positions.length - 1);
        setCurrentIndex(nextIndex);
        startTime = Date.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentIndex, positions]);
  
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(markerPosition);
    }
  }, [markerPosition]);

  return <Marker ref={markerRef} position={markerPosition} icon={trainIcon} />;
};

export default function LiveMap() {
  const { stations, stationCoords, lineColors } = useTransitData();
  const [selectedLine, setSelectedLine] = useState('LRT-2');
  const [selectedStation, setSelectedStation] = useState('');
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Set a default station when the line changes
  useEffect(() => {
      if (stations && stations[selectedLine]) {
          setSelectedStation(stations[selectedLine].stations[0]);
      }
  }, [selectedLine, stations]);

const handleFindTrain = async () => {
      if (!selectedStation || !selectedLine) return;
      setLoading(true);
      setEta(null);
      try {
          // This now correctly calls our backend and waits for a response
          const response = await axios.post('/api/eta', {
              line: selectedLine,
              station: selectedStation,
          });
          setEta(response.data.eta);
      } catch (error) {
          console.error("Failed to fetch ETA", error);
          setEta("Unavailable");
      } finally {
          setLoading(false);
      }
  };

  if (!stations || !stationCoords || !lineColors) {
    return <div className="p-4 text-center">Loading Map Data...</div>;
  }

  const mapCenter = [14.5995, 120.9842];

  return (
    <main className="max-w-7xl mx-auto p-4">
      <style>{`
        .custom-train-icon .pulsing-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px #333; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } }
      `}</style>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Train /> Find Next Train</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Line</label>
              <select value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                {Object.keys(stations).map((line) => (<option key={line} value={line}>{stations[line].name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Station</label>
              <select value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                {stations[selectedLine]?.stations.map((station) => (<option key={station} value={station}>{station}</option>))}
              </select>
            </div>
            <Button onClick={handleFindTrain} disabled={loading} className="w-full">
              {loading ? 'Calculating...' : 'Find Next Train'}
            </Button>
            {eta && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm text-gray-600">Next train arriving in:</p>
                <p className="text-3xl font-bold text-purple-600 flex items-center justify-center gap-2">
                  <Clock /> {eta}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 h-[75vh] w-full rounded-lg overflow-hidden border">
          <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.keys(stations).map(line => {
              const positions = stations[line].stations.map(station => stationCoords[line]?.[station]).filter(Boolean);
              if (positions.length < 2) return null;
              return (
                <React.Fragment key={line}>
                  <Polyline positions={positions} color={lineColors[line]} weight={4} opacity={0.7} />
                  <AnimatedTrain line={line} positions={positions} color={lineColors[line]} />
                </React.Fragment>
              );
            })}
            {Object.keys(stations).map(line => 
              stations[line].stations.map(station => {
                const position = stationCoords[line]?.[station];
                if (!position) return null;
                const isSelected = station === selectedStation;
                return (
                  <CircleMarker key={`${line}-${station}`} center={position} radius={isSelected ? 8 : 5} pathOptions={{ color: lineColors[line], fillColor: isSelected ? lineColors[line] : '#fff', fillOpacity: 1, weight: 2 }}>
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