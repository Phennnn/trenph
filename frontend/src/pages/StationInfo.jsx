import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '../context/DataContext';
import { MapPin, Phone, Clock as ClockIcon, Accessibility, ShoppingBag, Ticket, Wifi, UtensilsCrossed, ParkingCircle, UserCheck, BedDouble, Info } from 'lucide-react';
import MapView from '../components/MapView';

// Helper to map icon names to components
const iconMap = {
    ShoppingBag: <ShoppingBag size={20} />,
    Ticket: <Ticket size={20} />,
    Accessibility: <Accessibility size={20} />,
    Wifi: <Wifi size={20} />,
    UtensilsCrossed: <UtensilsCrossed size={20} />,
    ParkingCircle: <ParkingCircle size={20} />,
    UserCheck: <UserCheck size={20} />,
    BedDouble: <BedDouble size={20} />,
    Info: <Info size={20} />,
    FaTrain: <MapPin size={20}/>, // Placeholder
    FaLandmark: <MapPin size={20}/> // Placeholder
};


export default function StationInfo() {
  const transitData = useTransitData();
  const [infoLine, setInfoLine] = useState('LRT-1');
  
  // --- FIX 1: SAFELY INITIALIZE STATION STATE ---
  // We wait for transitData to be available before setting the initial station
  const [infoStation, setInfoStation] = useState(transitData?.stations?.[infoLine]?.stations[0] || '');

  const mapRef = useRef(null);

  // This effect ensures that when the line changes, the selected station resets safely
  React.useEffect(() => {
    if (transitData?.stations?.[infoLine]?.stations) {
      setInfoStation(transitData.stations[infoLine].stations[0]);
    }
  }, [infoLine, transitData]);

  // --- FIX 2: GET DETAILS SAFELY ---
  const details = transitData?.stationDetails?.[infoLine]?.[infoStation];
  
  return (
    <main className="max-w-4xl mx-auto p-4">
      <motion.section 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-white/70 to-blue-50/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Select a Station</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Train Line</label>
              <select 
                value={infoLine} 
                onChange={(e) => setInfoLine(e.target.value)} 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              >
                {/* --- FIX 3: ADD A GUARD BEFORE MAPPING --- */}
                {transitData?.stations && Object.keys(transitData.stations).map((line) => (
                  <option key={line} value={line}>{transitData.stations[line].name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Station</label>
              <select 
                value={infoStation} 
                onChange={(e) => setInfoStation(e.target.value)} 
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white/50"
              >
                 {/* --- FIX 4: ADD A GUARD BEFORE MAPPING --- */}
                {transitData?.stations?.[infoLine]?.stations.map((station) => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {details ? (
          <motion.div key={infoStation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
             <div className="bg-gradient-to-br from-white/70 to-blue-50/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg mb-6">
                 <h3 className="text-2xl font-bold text-blue-600 flex items-center gap-2 mb-4"><MapPin size={24} /> {infoStation} Station</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mb-4 text-gray-700">
                     <div className="flex items-center gap-3"><MapPin size={18} className="text-gray-500" /><span>{details.address}</span></div>
                     <div className="flex items-center gap-3"><Phone size={18} className="text-gray-500" /><span>{details.phone}</span></div>
                     <div className="flex items-center gap-3"><ClockIcon size={18} className="text-gray-500" /><span>{details.hours || transitData?.operatingHours?.[infoLine]}</span></div>
                 </div>
                 <p className="text-gray-600 text-sm">{details.description}</p>
             </div>
             <div className="bg-gradient-to-br from-white/70 to-blue-50/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg">
                <h4 className="text-xl font-semibold mb-4 text-purple-600">Station Amenities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.amenities.map(amenity => (
                        <div key={amenity.name} className="p-4 bg-white/50 rounded-lg border border-white/30 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {iconMap[amenity.icon] || <Info size={20} />}
                                <div>
                                    <p className="font-semibold text-gray-800">{amenity.name}</p>
                                    <p className="text-xs text-gray-500">{amenity.location}</p>
                                </div>
                            </div>
                            {amenity.available && <span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-1 rounded-full">Available</span>}
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-gradient-to-br from-white/70 to-yellow-50/50 backdrop-blur-sm border-white/20 shadow-lg p-6 rounded-lg text-center">
            <h3 className="font-semibold text-lg text-gray-800">No Detailed Information</h3>
            <p className="text-sm text-gray-600">Sorry, detailed information for {infoStation} is not yet available.</p>
          </div>
        )}
      </motion.section>
    </main>
  );
}

