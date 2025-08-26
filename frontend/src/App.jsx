import React, { useState } from 'react';
// Using the new '@' alias for reliable import paths.
import StationSelector from '@/components/StationSelector.jsx';
import MapView from '@/components/MapView.jsx';

/**
 * The main App component, now fully restored.
 * It manages the state for the selected train line and passes it
 * to both the StationSelector and MapView components.
 */
function App() {
  // State to hold the key of the selected train line (e.g., "LRT-1").
  const [selectedLine, setSelectedLine] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Station Selector */}
        <div className="md:col-span-1">
          <StationSelector 
            selectedLine={selectedLine} 
            onLineChange={setSelectedLine} 
          />
        </div>

        {/* Right Column: Map View */}
        <div className="md:col-span-2 h-[400px] md:h-auto">
          <MapView selectedLine={selectedLine} />
        </div>

      </div>
    </div>
  );
}

export default App;
