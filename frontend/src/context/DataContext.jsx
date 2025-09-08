import React, { createContext, useContext, useState, useEffect } from 'react';

// Import all JSON data files
import stations from '../data/stations.json';
import stationCoords from '../data/station_coords.json';
import stationDetails from '../data/station_details.json';
import lineColors from '../data/line_colors.json';
import interchanges from '../data/interchanges.json';
import landmarks from '../data/landmarks.json';
import fareMatrix from '../data/fare_matrix.json';
import operatingHours from '../data/operating_hours.json';
import pwdFriendly from '../data/pwd_friendly.json';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [transitData, setTransitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Merge all JSONs into a single object with fallbacks
        setTransitData({
          stations: stations || {},
          stationCoords: stationCoords || {},
          stationDetails: stationDetails || {},
          lineColors: lineColors || { 'LRT-1': '#FFC107', 'LRT-2': '#00A651', 'MRT-3': '#0072BC', 'PNR': '#8A2BE2' },
          interchanges: interchanges || {},
          landmarks: landmarks || [],
          fareMatrix: fareMatrix || {},
          operatingHours: operatingHours || {},
          pwdFriendly: pwdFriendly || {},
        });
      } catch (error) {
        console.error('Error loading transit data:', error);
        // Fallback to prevent crashes
        setTransitData({
          stations: {},
          stationCoords: {},
          stationDetails: {},
          lineColors: {},
          interchanges: {},
          landmarks: [],
          fareMatrix: {},
          operatingHours: {},
          pwdFriendly: {},
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Run once on mount

  // Render children only when data is ready
  return (
    <DataContext.Provider value={{ transitData, loading }}>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Loading Transit Data...</h2>
        </div>
      ) : (
        children
      )}
    </DataContext.Provider>
  );
};

export const useTransitData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useTransitData must be used within DataProvider');
  return context;
};