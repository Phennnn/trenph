import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Compass, Info, Settings, Tv, AlertTriangle, Route, HelpingHand, History as HistoryIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const { theme } = useAppContext();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 md:px-4 rounded-md border text-xs md:text-sm font-medium transition ${
      isActive
        ? 'bg-purple-600 text-white border-purple-600'
        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600'
    }`;

  return (
    <div className={`min-h-screen font-sans ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'dark bg-gray-900 text-gray-200'}`}>
      <section className="relative h-64 overflow-hidden">
        <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover" src="/gradient-video.mp4" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-blue-900/30"></div>
        <div className="relative z-10 flex items-center h-full text-white text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Tren-PH</h1>
            <p className="text-lg md:text-xl">Navigate Manila’s Rails with Ease</p>
          </div>
        </div>
      </section>

      {/* The only change is z-20 to z-50 right here 👇 */}
      <header className={`shadow-md p-4 flex items-center justify-center relative sticky top-0 z-50 ${theme === 'light' ? 'bg-white' : 'dark bg-gray-800'}`}>
        <nav className="flex items-center space-x-1 md:space-x-2 flex-wrap justify-center">
            <NavLink to="/" className={navLinkClass}><Map size={16} /> <span className="hidden md:inline">Planner</span></NavLink>
            <NavLink to="/history" className={navLinkClass}><HistoryIcon size={16} /> <span className="hidden md:inline">History</span></NavLink>
            <NavLink to="/landmarks" className={navLinkClass}><Compass size={16} /> <span className="hidden md:inline">Landmarks</span></NavLink>
            <NavLink to="/station-info" className={navLinkClass}><Info size={16} /> <span className="hidden md:inline">Stations</span></NavLink>
            <NavLink to="/connections" className={navLinkClass}><Route size={16} /> <span className="hidden md:inline">Connections</span></NavLink>
            <NavLink to="/accessibility" className={navLinkClass}><HelpingHand size={16} /> <span className="hidden md:inline">Accessibility</span></NavLink>
            <NavLink to="/live-map" className={navLinkClass}><Tv size={16} /> <span className="hidden md:inline">Live Map</span></NavLink>
            <NavLink to="/emergency" className={navLinkClass}><AlertTriangle size={16} /> <span className="hidden md:inline">Emergency</span></NavLink>
            <NavLink to="/settings" className={navLinkClass}><Settings size={16} /> <span className="hidden md:inline">Settings</span></NavLink>
        </nav>
      </header>
      
      <div className="relative">
        <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-0">
            <source src="/train-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10"></div>
        <main className="relative z-20">
          <Outlet />
        </main>
      </div>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 Tren-PH. All rights reserved.</p>
      </footer>
    </div>
  );
}