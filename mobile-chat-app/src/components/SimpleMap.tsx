import React, { useEffect, useRef } from 'react';
import './SimpleMap.css';

// Define types for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
    
    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else {
      initializeMap();
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    // Update markers when locations change
    if (mapRef.current && window.L) {
      updateMarkers();
    }
  }, [locations]);
  
  const initializeMap = () => {
    if (!mapContainerRef.current || !window.L) return;

    if(mapRef.current)
      return
    
    // Initialize the map
    const map = window.L.map(mapContainerRef.current).setView(center, 14);
    
    // Add the OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    mapRef.current = map;
    
    // Add markers
    updateMarkers();
  };
  
  const updateMarkers = () => {
    if (!mapRef.current || !window.L) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current.removeLayer(marker);
    });
    markersRef.current = [];
    
    // Create custom icon based on location type
    const createIcon = (type: string) => {
      let iconUrl = '';
      
      switch (type) {
        case 'recycling':
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/3156/3156365.png';
          break;
        case 'ev-charging':
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/8017/8017127.png';
          break;
        case 'zero-waste':
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/3695/3695526.png';
          break;
        case 'garden':
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/2379/2379473.png';
          break;
        default:
          iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
      }
      
      return window.L.icon({
        iconUrl,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
    };
    
    // Add markers for each location
    locations.forEach(location => {
      const marker = window.L.marker(location.position, {
        icon: createIcon(location.type)
      }).addTo(mapRef.current);
      
      marker.on('click', () => {
        setSelectedLocation(location);
      });
      
      markersRef.current.push(marker);
    });
  };
  
  return (
    <div className="simple-map-container">
      <div ref={mapContainerRef} className="leaflet-map"></div>
      
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