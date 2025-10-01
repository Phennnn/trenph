import React from 'react';
import { FaLandmark } from 'react-icons/fa'; // Assuming you use react-icons

// This component now receives its data as props.
// The `useTransitData` hook has been completely removed.
export default function MapLegend({ stationsData, landmarksData }) {
  // We can derive the line names directly from the stationsData prop
  const lines = stationsData ? Object.keys(stationsData) : [];

  const lineColors = {
    'LRT Line 1': 'bg-yellow-400',
    'LRT Line 2': 'bg-purple-600',
    'MRT Line 3': 'bg-blue-500',
    'PNR Metro Commuter Line': 'bg-orange-500',
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md border">
      <h3 className="font-bold mb-2 text-sm">Legend</h3>
      <ul className="space-y-1">
        {lines.map(line => (
          <li key={line} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${lineColors[line] || 'bg-gray-400'}`}></span>
            <span className="text-xs">{line}</span>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <FaLandmark className="text-gray-600" />
          <span className="text-xs">Landmark</span>
        </li>
      </ul>
    </div>
  );
}