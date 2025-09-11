import React from 'react';
import { useTransitData } from '@/context/DataContext';
import { FaLandmark } from 'react-icons/fa';

export default function MapLegend() {
  const { stations, lineColors } = useTransitData();

  if (!stations || !lineColors) {
    return null; // Don't render if data isn't available yet
  }

  return (
    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg z-[1000]">
      <h4 className="font-bold mb-2 text-sm text-gray-800">Legend</h4>
      <ul className="space-y-1">
        {Object.entries(lineColors).map(([line, color]) => (
          <li key={line} className="flex items-center text-xs text-gray-700">
            <span 
              className="w-3 h-3 inline-block rounded-full mr-2" 
              style={{ backgroundColor: color }}
            ></span>
            {stations[line]?.name || line}
          </li>
        ))}
        <li key="landmark" className="flex items-center text-xs text-gray-700">
          <span className="inline-block mr-2 text-gray-600">
            <FaLandmark />
          </span>
          Landmark
        </li>
      </ul>
    </div>
  );
}