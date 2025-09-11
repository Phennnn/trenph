import React, { useState } from 'react';

const PredictForm = ({ onSubmit, isLoading }) => {
  const [isHoliday, setIsHoliday] = useState(false);
  const [weatherIdx, setWeatherIdx] = useState(1);
  const [crowdLevel, setCrowdLevel] = useState(0.5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ isHoliday, weatherIdx, crowdLevel });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50/90 p-4 rounded-lg border"
    >
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Trip Options</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isHoliday}
            onChange={() => setIsHoliday(!isHoliday)}
            className="h-5 w-5"
          />
          <label className="text-sm text-gray-700">Is Holiday?</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weather</label>
          <select
            value={weatherIdx}
            onChange={(e) => setWeatherIdx(Number(e.target.value))}
            className="block w-full px-3 py-2 border rounded-md"
          >
            <option value={1}>Clear</option>
            <option value={2}>Rainy</option>
            <option value={3}>Stormy</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crowd Level</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={crowdLevel}
            onChange={(e) => setCrowdLevel(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{crowdLevel}</span>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-purple-700 text-white rounded-md disabled:bg-gray-400"
        >
          {isLoading ? 'Calculating...' : 'Calculate & Predict'}
        </button>
      </div>
    </motion.div>
  );
};

export default PredictForm;