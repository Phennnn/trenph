import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appStarted, setAppStarted] = useState(!!localStorage.getItem('token')); // App is "started" if user is logged in
  const [userType, setUserType] = useState(localStorage.getItem('userType') || 'Regular');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [defaultLine, setDefaultLine] = useState(localStorage.getItem('defaultLine') || 'LRT-1');
  
  // --- NEW: Authentication State ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Will hold user data in the future

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('userType', userType);
    localStorage.setItem('defaultLine', defaultLine);
    
    if (token) {
        localStorage.setItem('token', token);
        // In a real app, you'd fetch user data here using the token
    } else {
        localStorage.removeItem('token');
    }
  }, [theme, userType, defaultLine, token]);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setAppStarted(true);
  };

  // --- NEW: Auth Functions ---
  const login = (newToken) => {
    setToken(newToken);
    setAppStarted(true); // Mark app as started on login
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAppStarted(false); // Log out and send back to welcome/login screen
  };

  const value = {
    appStarted,
    userType,
    theme,
    setTheme,
    defaultLine,
    setDefaultLine,
    handleUserTypeSelect,
    setUserType,
    token, // Expose the token
    user,   // Expose user data
    login,  // Expose the login function
    logout, // Expose the logout function
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};