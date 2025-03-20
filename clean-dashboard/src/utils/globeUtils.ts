import { COBEOptions } from "cobe";

export const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1], // White color
  markerColor: [0.96, 0.23, 0.23], // Red color (matches Virgin red)
  glowColor: [1, 1, 1], // White glow
  markers: [
    // Europe
    { location: [51.5074, -0.1278], size: 0.08 }, // London
    { location: [48.8566, 2.3522], size: 0.07 }, // Paris
    { location: [52.5200, 13.4050], size: 0.06 }, // Berlin
    { location: [41.9028, 12.4964], size: 0.06 }, // Rome
    
    // North America
    { location: [40.7128, -74.0060], size: 0.1 }, // New York
    { location: [37.7749, -122.4194], size: 0.08 }, // San Francisco
    { location: [34.0522, -118.2437], size: 0.08 }, // Los Angeles
    { location: [43.6532, -79.3832], size: 0.06 }, // Toronto
    
    // Asia
    { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
    { location: [22.3193, 114.1694], size: 0.07 }, // Hong Kong
    { location: [1.3521, 103.8198], size: 0.06 }, // Singapore
    { location: [39.9042, 116.4074], size: 0.09 }, // Beijing
    
    // Middle East
    { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
    
    // Australia
    { location: [-33.8688, 151.2093], size: 0.07 }, // Sydney
    
    // South America
    { location: [-23.5505, -46.6333], size: 0.08 }, // São Paulo
  ],
};

// Utility function to convert className
export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
}; 