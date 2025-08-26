import React from 'react';
// Reverting to a relative path to ensure the file is found correctly.
import stationCoords from '../data/station_coords.json';

// We will conditionally destructure these to avoid the error.
const { MapContainer, TileLayer, Marker, Popup } = window.ReactLeaflet || {};
const L = window.L;

// This check prevents the icon workaround from running if Leaflet hasn't loaded.
if (L) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

/**
 * A component that displays an interactive map.
 * It now includes a check to ensure the Leaflet library is loaded.
 */
function MapView({ selectedLine }) {
  const manilaPosition = [14.6091, 121.0223];

  // If the MapContainer component isn't available yet, show a loading message.
  if (!MapContainer) {
    return (
      <div className="h-full w-full rounded-xl shadow-md bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Loading Map...</p>
      </div>
    );
  }

  const stations = selectedLine ? stationCoords[selectedLine] : {};
  const stationNames = Object.keys(stations);

  return (
    <div className="h-full w-full rounded-xl shadow-md overflow-hidden">
      <MapContainer center={manilaPosition} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedLine && stationNames.map(name => {
          const position = stations[name];
          return (
            <Marker key={name} position={position}>
              <Popup>{name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
