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
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function ProtectedRoute({ children }) {
  const { appStarted } = useAppContext();
  return appStarted ? children : <Navigate to="/welcome" />;
}

function App() {
  const { appStarted } = useAppContext();

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        {/* These pages are accessible to everyone and do not use the main layout */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Routes --- */}
        {/* These pages are only accessible after the initial setup and use the main Layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
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

        {/* --- Fallback Route --- */}
        <Route path="*" element={<Navigate to={appStarted ? "/" : "/welcome"} />} />
      </Routes>
    </Router>
  );
}

export default App;