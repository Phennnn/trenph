import React from 'react';
import { motion } from 'framer-motion';

const ResultCard = ({ minutes }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-gray-50/90 rounded-lg border text-center"
    >
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Predicted Travel Time</h3>
      <p className="text-2xl font-bold text-purple-600">{minutes || 'N/A'}</p>
    </motion.div>
  );
};

export default ResultCard;