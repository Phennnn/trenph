import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
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
      <div className="relative z-20 flex items-center justify-center h-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg max-w-sm w-full text-white"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md"
              />
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Register
            </button>
          </form>
          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}