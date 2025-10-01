import React from 'react';
import MapLegend from './MapLegend'; // We will refactor this next

// This component receives all the data from Planner.jsx
export default function TransitMap({ stationsData, landmarksData, connectionsData, journeyData }) {
  return (
    <div className="h-full w-full relative bg-gray-200 rounded-lg">
      
      {/* This is a placeholder for your actual map implementation (e.g., Leaflet, Mapbox).
        The map itself would use the `stationsData` and `journeyData` to draw lines and markers.
      */}
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Map Area</p>
      </div>

      {/* The map legend is positioned on top of the map.
        We pass the necessary data down to it as props.
      */}
      <div className="absolute top-2 right-2">
        <MapLegend 
          stationsData={stationsData} 
          landmarksData={landmarksData} 
        />
      </div>

    </div>
  );
}