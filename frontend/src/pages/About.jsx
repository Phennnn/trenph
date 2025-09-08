import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-4xl font-bold mb-4">About Tren-PH</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        This page is under construction. Information about the Tren-PH project will be available here soon.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Go Back to Homepage
      </Link>
    </div>
  );
}

