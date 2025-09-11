import React, { createContext, useContext, useState, useEffect } from 'react';
import stations from '@/data/stations.json';
import stationCoords from '@/data/station_coords.json';
import stationDetails from '@/data/station_details.json';
import { lineColors, interchanges, fareMatrix, operatingHours, pwdFriendlyStations } from '@/data/constants.js';
import landmarks from '@/data/landmarks.json';
import emergencyContacts from '@/data/emergency_contacts.json';
import evacuationRoutes from '@/data/evacuation_routes.json';
import connections from '@/data/connections.json';
import accessibilityFeatures from '@/data/accessibility_features.json';
import accessibilityRoutes from '@/data/accessibility_routes.json';
import assistanceServices from '@/data/assistance_services.json';
import journeyHistory from '@/data/journey_history.json';
import monthlyStats from '@/data/monthly_stats.json';     
import favoriteRoutes from '@/data/favorite_routes.json';


const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [transitData, setTransitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        setTransitData({
          stations,
          stationCoords,
          stationDetails,
          lineColors,
          interchanges,
          landmarks,
          fareMatrix,
          operatingHours,
          pwdFriendlyStations,
          emergencyContacts,
          evacuationRoutes,
          connections,
          accessibilityFeatures,
          accessibilityRoutes,
          assistanceServices,
          journeyHistory,
          monthlyStats,
          favoriteRoutes,
        });
      } catch (error) {
        console.error('Error loading transit data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-lg font-semibold">Loading Transit Data...</h2>
      </div>
    );
  }

  return (
    <DataContext.Provider value={transitData}>
      {children}
    </DataContext.Provider>
  );
};

export const useTransitData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useTransitData must be used within a DataProvider');
  }
  return context;
};