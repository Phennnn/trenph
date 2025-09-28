import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import WelcomeWeather from '../components/WelcomeWeather';

export default function Welcome() {
  const { handleUserTypeSelect } = useAppContext();
  const navigate = useNavigate();

  const onSelect = (type) => {
    handleUserTypeSelect(type);
    navigate('/planner'); // Redirect to planner after selection
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="absolute top-1/2 left-1/2 w-auto min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 z-0"
      >
        <source src="/gradient-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          Welcome to Tren-PH
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-2xl mb-8"
        >
          Please select your passenger type to begin.
        </motion.p>
        
        <WelcomeWeather />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <motion.button
            whileHover={{ scale: 1.05, borderColor: '#fff' }}
            onClick={() => onSelect('Regular')}
            className="p-6 text-white border border-white/50 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 w-full h-32 flex flex-col items-center justify-center"
          >
            <span className="text-2xl font-bold mb-2 uppercase tracking-wider">Regular / Student</span>
            <span className="text-sm font-normal normal-case tracking-normal text-center px-4">Standard access to all features.</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: '#fff' }}
            onClick={() => onSelect('PWD')}
            className="p-6 text-white border border-white/50 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 w-full h-32 flex flex-col items-center justify-center"
          >
            <span className="text-2xl font-bold mb-2 uppercase tracking-wider">Senior / PWD</span>
            <span className="text-sm font-normal normal-case tracking-normal text-center px-4">Enhanced accessibility options.</span>
          </motion.button>
        </div>
        
        {/* NEW: Login/Register links for returning users */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-12 text-gray-300"
        >
            Already have an account? <Link to="/login" className="font-semibold text-purple-400 hover:underline">Login here</Link> or <Link to="/register" className="font-semibold text-purple-400 hover:underline">Create a new one</Link>.
        </motion.div>

      </div>
    </div>
  );
}