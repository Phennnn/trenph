import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appStarted, setAppStarted] = useState(false);
  const [userType, setUserType] = useState(localStorage.getItem('userType') || 'Regular');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [defaultLine, setDefaultLine] = useState(localStorage.getItem('defaultLine') || 'LRT-1');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('userType', userType);
    localStorage.setItem('defaultLine', defaultLine);
  }, [theme, userType, defaultLine]);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setAppStarted(true);
  };

  const value = {
    appStarted,
    userType,
    theme,
    setTheme,
    defaultLine,
    setDefaultLine,
    handleUserTypeSelect,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};