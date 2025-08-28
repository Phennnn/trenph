import React, { useState } from 'react';
// Correcting the import path to be relative to the current file.
import stationData from '../data/stations.json';

/**
 * A component that allows users to select a train line and a station.
 * It receives the currently selected line and a function to change it via props.
 */
function StationSelector({ selectedLine, onLineChange }) {
  // The selected station state can remain here as no other component needs it.
  const [selectedStation, setSelectedStation] = useState('');

  const trainLines = Object.keys(stationData);

  const handleLineChange = (event) => {
    const newLine = event.target.value;
    // Call the function passed from the parent (App.jsx) to update the state there.
    onLineChange(newLine);
    setSelectedStation(''); // Reset station on new line selection.
  };

  const handleStationChange = (event) => {
    setSelectedStation(event.target.value);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Select Your Station</h2>
      
      <div>
        <label htmlFor="line-select" className="block text-sm font-medium text-gray-700 mb-1">
          Train Line
        </label>
        <select
          id="line-select"
          value={selectedLine} // The value is now controlled by the parent's state.
          onChange={handleLineChange}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="" disabled>-- Please choose a line --</option>
          {trainLines.map((lineKey) => (
            <option key={lineKey} value={lineKey}>
              {stationData[lineKey].name}
            </option>
          ))}
        </select>
      </div>

      {selectedLine && (
        <div>
          <label htmlFor="station-select" className="block text-sm font-medium text-gray-700 mb-1">
            Station
          </label>
          <select
            id="station-select"
            value={selectedStation}
            onChange={handleStationChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>-- Select a station --</option>
            {stationData[selectedLine].stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>
      )}S

      {selectedLine && selectedStation && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-600">Your Selection:</p>
          <p className="font-semibold text-lg text-indigo-600">
            {selectedStation} <span className="font-normal text-gray-500">({stationData[selectedLine].name})</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default StationSelector;
