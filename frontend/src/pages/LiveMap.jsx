import React from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '../context/DataContext';
import { Train } from 'lucide-react';

export default function LiveMap() {
  const transitData = useTransitData();

  // A guard to ensure data is loaded before rendering
  if (!transitData?.lineColors) {
    return (
        <main className="max-w-7xl mx-auto p-4 text-center">
            <p>Loading Map Data...</p>
        </main>
    );
  }

  // Define SVG paths for each train line in a simplified, stylized way
  const linePaths = {
    "LRT-1": "M 50 20 V 480", // Yellow Line (Vertical)
    "LRT-2": "M 20 250 H 480", // Green Line (Horizontal)
    "MRT-3": "M 450 20 C 400 150, 400 350, 450 480", // Blue Line (Curved)
    "PNR": "M 250 20 V 480" // Purple Line (Vertical, Center)
  };
  
  // Define animations for the trains
  const animations = `
    @keyframes move-lrt1 { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
    @keyframes move-lrt2 { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
    @keyframes move-mrt3 { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
    @keyframes move-pnr { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }

    .train-lrt1 { offset-path: path('${linePaths["LRT-1"]}'); animation: move-lrt1 20s linear infinite; }
    .train-lrt2 { offset-path: path('${linePaths["LRT-2"]}'); animation: move-lrt2 18s linear infinite reverse; }
    .train-mrt3 { offset-path: path('${linePaths["MRT-3"]}'); animation: move-mrt3 15s linear infinite; }
    .train-pnr { offset-path: path('${linePaths["PNR"]}'); animation: move-pnr 30s linear infinite; }
  `;

  return (
    <main className="max-w-5xl mx-auto p-4">
       <style>{animations}</style>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm border shadow-lg p-6 rounded-lg"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Live Transit Activity</h2>
        <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <svg width="100%" height="100%" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
                {/* Draw the train line paths */}
                <path d={linePaths["LRT-1"]} stroke={transitData.lineColors["LRT-1"]} strokeWidth="4" fill="none" />
                <path d={linePaths["LRT-2"]} stroke={transitData.lineColors["LRT-2"]} strokeWidth="4" fill="none" />
                <path d={linePaths["MRT-3"]} stroke={transitData.lineColors["MRT-3"]} strokeWidth="4" fill="none" />
                <path d={linePaths["PNR"]} stroke={transitData.lineColors["PNR"]} strokeWidth="4" fill="none" />

                {/* Interchange Stations */}
                <circle cx="50" cy="250" r="6" fill="white" stroke="black" strokeWidth="2" />
                <circle cx="250" cy="250" r="6" fill="white" stroke="black" strokeWidth="2" />
                <circle cx="450" cy="250" r="6" fill="white" stroke="black" strokeWidth="2" />
            </svg>

            {/* Animated Train Icons */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="train-lrt1 absolute">
                    <Train size={20} style={{ color: transitData.lineColors["LRT-1"], filter: 'drop-shadow(0 0 2px black)' }} />
                </div>
                <div className="train-lrt2 absolute">
                    <Train size={20} style={{ color: transitData.lineColors["LRT-2"], filter: 'drop-shadow(0 0 2px black)' }} />
                </div>
                 <div className="train-mrt3 absolute">
                    <Train size={20} style={{ color: transitData.lineColors["MRT-3"], filter: 'drop-shadow(0 0 2px black)' }} />
                </div>
                <div className="train-pnr absolute" style={{ animationDelay: '-15s' }}>
                    <Train size={20} style={{ color: transitData.lineColors["PNR"], filter: 'drop-shadow(0 0 2px black)' }} />
                </div>
            </div>
        </div>
         <div className="flex justify-center flex-wrap gap-4 mt-4">
            {Object.entries(transitData.lineColors).map(([line, color]) => (
                <div key={line} className="flex items-center text-sm font-medium">
                    <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                    {transitData.stations[line].name}
                </div>
            ))}
        </div>
      </motion.div>
    </main>
  );
}

