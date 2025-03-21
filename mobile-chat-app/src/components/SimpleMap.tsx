import React from 'react';
import './SimpleMap.css';

export interface Location {
  id: number;
  name: string;
  type: 'recycling' | 'ev-charging' | 'zero-waste' | 'garden';
  position: [number, number]; // [latitude, longitude]
  address: string;
  description: string;
}

interface SimpleMapProps {
  locations: Location[];
  center: [number, number];
}

const SimpleMap: React.FC<SimpleMapProps> = ({ locations, center }) => {
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  
  // Simple map with pins rendered as absolute-positioned elements
  // Not as interactive as leaflet but works without external dependencies
  return (
    <div className="simple-map-container">
      <div className="simple-map">
        <img 
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${center[0]},${center[1]}&zoom=14&size=600x400&maptype=roadmap&markers=color:red%7C${locations.map(loc => `${loc.position[0]},${loc.position[1]}`).join('|')}&key=`} 
          alt="Map of St. Gallen"
          className="static-map-image"
        />
        <div className="simple-map-overlay">
          {locations.map(location => (
            <div 
              key={location.id}
              className={`map-pin ${location.type}`}
              style={{
                top: `${50 - (location.position[0] - center[0]) * 500}%`,
                left: `${50 + (location.position[1] - center[1]) * 500}%`
              }}
              onClick={() => setSelectedLocation(location)}
            />
          ))}
        </div>
      </div>
      
      {selectedLocation && (
        <div className="location-popup">
          <div className="popup-header">
            <h3>{selectedLocation.name}</h3>
            <button className="close-button" onClick={() => setSelectedLocation(null)}>×</button>
          </div>
          <p className="popup-address">{selectedLocation.address}</p>
          <p className="popup-description">{selectedLocation.description}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleMap; 