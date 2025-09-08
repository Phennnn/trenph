import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appStarted, setAppStarted] = useState(false);
  const [userType, setUserType] = useState('Regular');
  const [theme, setTheme] = useState('light');
  // You can add other global settings like fontSize here later

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setAppStarted(true); // This is the key action that hides the welcome screen
  };

  const value = {
    appStarted,
    userType,
    theme,
    setTheme,
    handleUserTypeSelect,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
