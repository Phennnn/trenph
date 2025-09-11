import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

import Layout from './components/Layout.jsx';
import Welcome from './pages/Welcome.jsx';
import Planner from './pages/Planner.jsx';
import Landmarks from './pages/Landmarks.jsx';
import StationInfo from './pages/StationInfo.jsx';
import Connections from './pages/Connections.jsx';
import LiveMap from './pages/LiveMap.jsx';
import Emergency from './pages/Emergency.jsx';
import Settings from './pages/Settings.jsx';
import Accessibility from './pages/Accessibility.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

function ProtectedRoute({ children }) {
  const { appStarted } = useAppContext();
  return appStarted ? children : <Navigate to="/welcome" />;
}

/**
 * The main App component that sets up all the application's routes.
 */
function App() {
  const { appStarted } = useAppContext();

  return (
    <Router>
      <Routes>
        {/* Route #1: The Welcome Page */}
        {/* Everyone starts here. */}
        <Route path="/welcome" element={<Welcome />} />

        {/* Route #2: The Main Application Layout */}
        {/* This route is protected. It contains all the other pages. */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* These are the pages inside the main layout */}
          <Route index element={<Planner />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="landmarks" element={<Landmarks />} />
          <Route path="station-info" element={<StationInfo />} />
          <Route path="connections" element={<Connections />} />
          <Route path="accessibility" element={<Accessibility />} />
          <Route path="live-map" element={<LiveMap />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Route #3: The Fallback Route */}
        {/* If a user types a random URL, this redirects them to the correct starting page. */}
        <Route path="*" element={<Navigate to={appStarted ? "/" : "/welcome"} />} />
      </Routes>
    </Router>
  );
}

export default App;