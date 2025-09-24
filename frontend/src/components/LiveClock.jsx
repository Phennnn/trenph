import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <h3 className="text-center text-2xl font-bold text-gray-800">{currentTime.toLocaleTimeString()}</h3>
      <div className="text-center text-xs text-gray-500">{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </>
  );
};

export default LiveClock;