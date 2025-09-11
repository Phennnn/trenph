import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MapView = ({ center = [14.5995, 120.9842], zoom = 12, setupMap }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        // Dynamically load Leaflet
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        if (!mapRef.current && containerRef.current) {
          const map = L.map(containerRef.current).setView(center, zoom);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);
          mapRef.current = map;

          if (setupMap) {
            setupMap(map);
          }
        }
      } catch (error) {
        console.error('MapView error:', error);
      }
    };

    loadMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom, setupMap]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full"
      ref={containerRef}
    />
  );
};

export default MapView;