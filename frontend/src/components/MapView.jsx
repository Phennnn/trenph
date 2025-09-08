import React, { useEffect, useRef } from 'react';

// A single, robust function to load scripts and CSS
const loadResource = (id, url, type) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    let element;
    if (type === 'script') {
      element = document.createElement('script');
      element.src = url;
    } else if (type === 'css') {
      element = document.createElement('link');
      element.rel = 'stylesheet';
      element.href = url;
    }
    element.id = id;
    element.onload = () => resolve();
    element.onerror = () => reject(new Error(`Failed to load resource: ${url}`));
    document.head.appendChild(element);
  });
};

const MapView = ({ center, zoom, setupMap }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Ensure the container is ready before doing anything
    if (!mapRef.current) return;
    
    // Guard against invalid center coordinates
    if (!center || typeof center[0] !== 'number' || typeof center[1] !== 'number') {
        console.error("Invalid map center coordinates provided:", center);
        return;
    }

    let isMounted = true;

    const initMap = async () => {
      try {
        // Load Leaflet resources
        await loadResource('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'css');
        await loadResource('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'script');

        // Only proceed if component is still mounted and Leaflet is loaded
        if (isMounted && window.L) {
          // If a map instance already exists on this container, remove it first.
          if (mapInstance.current) {
            mapInstance.current.remove();
          }

          // Create the new map instance
          const map = window.L.map(mapRef.current, { zoomControl: false }).setView(center, zoom);
          mapInstance.current = map;
          
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          // Run the custom setup function for this specific map (e.g., drawing lines, markers)
          if (setupMap) {
            setupMap(map);
          }
        }
      } catch (error) {
        console.error("Could not initialize map:", error);
      }
    };

    initMap();

    // The crucial cleanup function
    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom, setupMap]); // Rerun effect if these props change

  return <div ref={mapRef} className="w-full h-full bg-gray-200"></div>;
};

export default MapView;

