import React, { useState } from 'react';
import { useTransitData } from '../context/DataContext';
import { useAppContext } from '../context/AppContext';

function StationSelector({ selectedLine, onLineChange, onStationChange, label }) {
  const { transitData } = useTransitData();
  const { userType } = useAppContext();
  const [selectedStation, setSelectedStation] = useState('');

  const trainLines = Object.keys(transitData?.stations || {});
  const stations = transitData?.stations?.[selectedLine]?.stations || [];
  // Filter for PWD if enabled
  const filteredStations = userType === 'PWD' || userType === 'Senior'
    ? stations.filter(station => transitData?.pwdFriendly?.[selectedLine]?.includes(station))
    : stations;

  const handleLineChange = (event) => {
    const newLine = event.target.value;
    onLineChange(newLine);
    setSelectedStation('');
    onStationChange('');
  };

  const handleStationChange = (event) => {
    const newStation = event.target.value;
    setSelectedStation(newStation);
    onStationChange(newStation);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{label || 'Select Your Station'}</h2>
      <div>
        <label htmlFor="line-select" className="block text-sm font-medium text-gray-700 mb-1">
          Train Line
        </label>
        <select
          id="line-select"
          value={selectedLine}
          onChange={handleLineChange}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="" disabled>-- Please choose a line --</option>
          {trainLines.map((lineKey) => (
            <option key={lineKey} value={lineKey}>
              {transitData?.stations?.[lineKey]?.name || lineKey}
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
            {filteredStations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedLine && selectedStation && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-600">Your Selection:</p>
          <p className="font-semibold text-lg text-indigo-600">
            {selectedStation} <span className="font-normal text-gray-500">({transitData?.stations?.[selectedLine]?.name})</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default StationSelector;