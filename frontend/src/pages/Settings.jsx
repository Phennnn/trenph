import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Type, Accessibility, Trash2, Info } from 'lucide-react';

// This would typically come from a context to persist the settings
const useAppSettings = () => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('text-base');
  const [showPwdFriendly, setShowPwdFriendly] = useState(false);
  const [defaultUserType, setDefaultUserType] = useState('Regular');

  // Dummy functions for demonstration
  const clearCache = () => {
    alert("User cache and preferences have been cleared!");
  };

  return { 
    theme, setTheme, 
    fontSize, setFontSize, 
    showPwdFriendly, setShowPwdFriendly,
    defaultUserType, setDefaultUserType,
    clearCache
  };
};


export default function Settings() {
  const { 
    theme, setTheme, 
    fontSize, setFontSize, 
    showPwdFriendly, setShowPwdFriendly,
    defaultUserType, setDefaultUserType,
    clearCache
  } = useAppSettings();

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Application Settings</h2>
        
        {/* --- Display Settings --- */}
        <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">Display</h3>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {theme === 'light' ? <Sun /> : <Moon />}
                    <label>Theme</label>
                </div>
                <button onClick={handleThemeChange} className="px-4 py-2 rounded-md border text-sm font-medium transition bg-gray-200 dark:bg-slate-700">
                    Switch to {theme === 'light' ? 'Dark' : 'Light'}
                </button>
            </div>
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3"><Type /><label>Font Size</label></div>
                <div className="flex space-x-2">
                    <button onClick={() => setFontSize('text-sm')} className={`px-4 py-2 rounded-md border text-sm font-medium ${fontSize === 'text-sm' ? 'bg-purple-600 text-white' : ''}`}>Small</button>
                    <button onClick={() => setFontSize('text-base')} className={`px-4 py-2 rounded-md border text-sm font-medium ${fontSize === 'text-base' ? 'bg-purple-600 text-white' : ''}`}>Medium</button>
                    <button onClick={() => setFontSize('text-lg')} className={`px-4 py-2 rounded-md border text-sm font-medium ${fontSize === 'text-lg' ? 'bg-purple-600 text-white' : ''}`}>Large</button>
                </div>
            </div>
        </div>

        {/* --- Accessibility & Preferences --- */}
        <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">Preferences</h3>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><Accessibility /><label>Highlight PWD Stations</label></div>
                <input type="checkbox" checked={showPwdFriendly} onChange={() => setShowPwdFriendly(!showPwdFriendly)} className="h-6 w-6 rounded"/>
            </div>
             <div className="flex items-center justify-between">
                <label>Default User Type</label>
                <select value={defaultUserType} onChange={(e) => setDefaultUserType(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700">
                    <option>Regular</option>
                    <option>Student</option>
                    <option>Senior</option>
                    <option>PWD</option>
                </select>
            </div>
        </div>
        
        {/* --- Data Management --- */}
        <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 border-b pb-2">Data</h3>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Trash2 className="text-red-500" /><label>Clear Application Data</label></div>
                <button onClick={clearCache} className="px-4 py-2 rounded-md border text-sm font-medium bg-red-500 text-white hover:bg-red-600">
                    Clear Cache
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">This will reset all your saved preferences and trip history.</p>
        </div>

      </motion.section>
    </main>
  );
}
