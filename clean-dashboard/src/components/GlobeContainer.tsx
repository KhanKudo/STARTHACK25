import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobeConfig, Position, World } from './Globe';
import './Globe.css';
import { projectData, virginLocations } from '../utils/projectData';

const GlobeContainer: React.FC = () => {
  const navigate = useNavigate();

  // Function to handle point clicks and navigate to project pages
  const handlePointClick = (point: any, event: any) => {
    if (point && point.company && point.initiative) {
      console.log("Point clicked:", point);

      // Examples of company abbreviations in the projectData.ts file:
      // Virgin Atlantic -> va
      // Virgin Voyages -> vv
      // Virgin Media 02 -> vmo2
      // Virgin Unite -> vu
      // Virgin Limited Edition -> vle

      // Create the company prefix based on naming pattern
      let companyPrefix = "";

      // Special case handling
      if (point.company.includes("Virgin Atlantic")) {
        companyPrefix = "va";
      }
      else if (point.company.includes("Virgin Voyages")) {
        companyPrefix = "vv";
      }
      else if (point.company.includes("Virgin Media")) {
        companyPrefix = "vmo2";
      }
      else if (point.company.includes("Virgin Unite")) {
        companyPrefix = "vu";
      }
      else if (point.company.includes("Virgin Limited")) {
        companyPrefix = "vle";
      }
      else {
        // Generic abbreviation for other Virgin companies
        companyPrefix = point.company
          .toLowerCase()
          .split('&')[0]
          .trim()
          .split(' ')
          .filter((word: string) => word !== "virgin") // Remove "virgin" from abbreviation
          .map((word: string) => word.charAt(0))
          .join('');

        if (companyPrefix === "") {
          companyPrefix = "v"; // Default to "v" if no other words
        }
      }

      // Get first word of initiative and clean it
      const initiativeWord = point.initiative
        .toLowerCase()
        .replace(/[\s\W]+/g, '-') // Replace whitespace and non-word chars with hyphens
        .split('-')[0]; // Get first word

      const projectId = `${companyPrefix}-${initiativeWord}`;
      console.log("Navigating to project ID:", projectId);
      navigate(`/project/${projectId}`);
    }
  };

  // Arc data for globe connections
  const arcData: Position[] = [
    {
      order: 1,
      color: "rgba(255, 92, 241, 0.8)",
      startLat: 51.4700,
      startLng: -0.4543,
      endLat: 25.7617,
      endLng: -80.1918,
      arcAlt: 0.3
    },
    {
      order: 2,
      color: "rgba(255, 92, 241, 0.8)",
      startLat: 25.7617,
      startLng: -80.1918,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3
    },
    {
      order: 3,
      color: "rgba(255, 92, 241, 0.8)",
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 51.5074,
      endLng: -0.1278,
      arcAlt: 0.5
    }
  ];

  // Configure the globe settings
  const globeConfig = {
    globeColor: "#FFFFFF",
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 0.3,
    shininess: 1.0,
    arcTime: 2000,
    arcLength: 0.9,
    autoRotate: true,
    polygonColor: "rgba(60, 60, 60, 0.7)",
    markers: projectData.filter(pro => 'location' in pro) as GlobeConfig['markers']
  };

  return (
    <div className="globe-container" style={{ pointerEvents: 'all' }}>
      <div className="globe-wrapper" style={{ pointerEvents: 'all' }}>
        <World
          globeConfig={globeConfig}
          data={arcData}
          onPointClick={handlePointClick}
        />
      </div>
    </div>
  );
};

export default GlobeContainer; 