import React from 'react';
import { Position, World } from './Globe';
import './Globe.css';

const GlobeContainer: React.FC = () => {
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
    polygonColor: "rgba(60, 60, 60, 0.7)"
  };

  // Define the arc connections between cities (major Virgin routes)
  const arcData: Position[] = [
    // New York to London connection (Virgin Atlantic route)
    {
      order: 0,
      startLat: 40.7128,
      startLng: -74.0060,
      endLat: 51.5074,
      endLng: -0.1278,
      arcAlt: 0.5,
      color: "#F50057" // Virgin red color
    },
    // London to Sydney (Virgin Atlantic/Virgin Australia connection)
    {
      order: 1,
      startLat: 51.5074,
      startLng: -0.1278,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.6,
      color: "#F50057"
    },
    // London to Las Vegas (Virgin Atlantic route)
    {
      order: 2,
      startLat: 51.5074,
      startLng: -0.1278,
      endLat: 36.1699,
      endLng: -115.1398,
      arcAlt: 0.5,
      color: "#F50057"
    },
    // London to Miami (Virgin Atlantic/Virgin Voyages connection)
    {
      order: 3,
      startLat: 51.5074,
      startLng: -0.1278,
      endLat: 25.7617,
      endLng: -80.1918,
      arcAlt: 0.4,
      color: "#F50057"
    },
    // New York to Miami (Virgin Voyages cruise route)
    {
      order: 4,
      startLat: 40.7128,
      startLng: -74.0060,
      endLat: 25.7617,
      endLng: -80.1918,
      arcAlt: 0.3,
      color: "#F50057"
    }
  ];

  // Virgin company headquarters and key locations
  // Using a larger size (0.1-0.12) for global headquarters and main offices
  // Using medium size (0.06-0.08) for regional hubs
  // Using smaller size (0.04-0.05) for smaller offices and locations
  const virginLocations: Array<{
    location: [number, number];
    size: number;
    company?: string;
    initiative?: string;
    link?: string;
  }> = [
    // Global Headquarters
    { 
      location: [51.5074, -0.1278], 
      size: 0.12,
      company: "Virgin Group",
      initiative: "Global Headquarters",
      link: "https://www.virgin.com"
    }, // London, UK - Virgin Group HQ
    
    // Major Regional Headquarters
    { 
      location: [40.7128, -74.0060], 
      size: 0.1,
      company: "Virgin USA",
      initiative: "Regional Headquarters",
      link: "https://www.virgin.com/usa"
    }, // New York, USA - Virgin USA
    { 
      location: [-33.8688, 151.2093], 
      size: 0.1,
      company: "Virgin Australia",
      initiative: "Airline Headquarters",
      link: "https://www.virginaustralia.com"
    }, // Sydney, Australia - Virgin Australia
    
    // Virgin Atlantic Headquarters
    { 
      location: [51.1437, -0.1869], 
      size: 0.09,
      company: "Virgin Atlantic",
      initiative: "Airline Headquarters",
      link: "https://www.virginatlantic.com"
    }, // Crawley, UK (near London) - Virgin Atlantic HQ
    
    // Virgin Voyages HQ
    { 
      location: [25.7617, -80.1918], 
      size: 0.09,
      company: "Virgin Voyages",
      initiative: "Cruise Line Headquarters",
      link: "https://www.virginvoyages.com"
    }, // Miami, FL - Virgin Voyages
    
    // Virgin Hotels Locations
    { 
      location: [36.1699, -115.1398], 
      size: 0.08,
      company: "Virgin Hotels",
      initiative: "Las Vegas Resort",
      link: "https://virginhotels.com/las-vegas"
    }, // Las Vegas, NV - Virgin Hotels
    { 
      location: [41.8781, -87.6298], 
      size: 0.07,
      company: "Virgin Hotels",
      initiative: "Chicago Hotel",
      link: "https://virginhotels.com/chicago"
    }, // Chicago, IL - Virgin Hotels
    { 
      location: [32.7767, -96.7970], 
      size: 0.07,
      company: "Virgin Hotels",
      initiative: "Dallas Hotel",
      link: "https://virginhotels.com/dallas"
    }, // Dallas, TX - Virgin Hotels
    { 
      location: [29.7604, -95.3698], 
      size: 0.07,
      company: "Virgin Hotels",
      initiative: "Houston Hotel",
      link: "https://virginhotels.com/houston"
    }, // Houston, TX - Virgin Hotels
    
    // Virgin Galactic
    { 
      location: [32.9903, -106.9753], 
      size: 0.08,
      company: "Virgin Galactic",
      initiative: "Space Tourism Launch Site",
      link: "https://www.virgingalactic.com"
    }, // Truth or Consequences, NM - Spaceport America
    
    // Virgin Mobile/Media Major Offices
    { 
      location: [19.4326, -99.1332], 
      size: 0.06,
      company: "Virgin Mobile",
      initiative: "Mexico Operations",
      link: "https://www.virgin.com/virgin-companies"
    }, // Mexico City - Virgin Mobile Mexico
    { 
      location: [4.7110, -74.0721], 
      size: 0.06,
      company: "Virgin Mobile",
      initiative: "Colombia Operations",
      link: "https://www.virgin.com/virgin-companies"
    }, // Bogotá, Colombia - Virgin Mobile
    { 
      location: [31.5497, 74.3436], 
      size: 0.05,
      company: "Virgin Mobile",
      initiative: "Pakistan Operations",
      link: "https://www.virgin.com/virgin-companies"
    }, // Lahore, Pakistan - Virgin Mobile
    { 
      location: [29.3759, 47.9774], 
      size: 0.05,
      company: "Virgin Mobile",
      initiative: "Kuwait Operations",
      link: "https://www.virgin.com/virgin-companies"
    }, // Kuwait City - Virgin Mobile
    { 
      location: [24.4539, 54.3773], 
      size: 0.05,
      company: "Virgin Mobile",
      initiative: "UAE Operations",
      link: "https://www.virgin.com/virgin-companies"
    }, // Abu Dhabi, UAE - Virgin Mobile
    
    // Virgin Active Fitness
    { 
      location: [-33.9249, 18.4241], 
      size: 0.07,
      company: "Virgin Active",
      initiative: "South Africa Fitness",
      link: "https://www.virginactive.co.za"
    }, // Cape Town, South Africa - Virgin Active
    { 
      location: [45.4642, 9.1900], 
      size: 0.06,
      company: "Virgin Active",
      initiative: "Italy Fitness",
      link: "https://www.virginactive.it"
    }, // Milan, Italy - Virgin Active
    { 
      location: [-26.2041, 28.0473], 
      size: 0.06,
      company: "Virgin Active",
      initiative: "South Africa Fitness",
      link: "https://www.virginactive.co.za"
    }, // Johannesburg, South Africa - Virgin Active
    { 
      location: [1.3521, 103.8198], 
      size: 0.05,
      company: "Virgin Active",
      initiative: "Singapore Fitness",
      link: "https://www.virginactive.com.sg"
    }, // Singapore - Virgin Active
    { 
      location: [13.7563, 100.5018], 
      size: 0.05,
      company: "Virgin Active",
      initiative: "Thailand Fitness",
      link: "https://www.virginactive.co.th"
    }, // Bangkok, Thailand - Virgin Active

    // Other key Virgin locations
    { 
      location: [37.7749, -122.4194], 
      size: 0.07,
      company: "Virgin Enterprises",
      initiative: "West Coast Operations",
      link: "https://www.virgin.com"
    }, // San Francisco, CA - Virgin businesses
    { 
      location: [33.4484, -112.0740], 
      size: 0.06,
      company: "Virgin Galactic",
      initiative: "Manufacturing Facility",
      link: "https://www.virgingalactic.com"
    }, // Phoenix, AZ - Virgin Galactic manufacturing
    { 
      location: [34.0522, -118.2437], 
      size: 0.07,
      company: "Virgin Entertainment",
      initiative: "Media Operations",
      link: "https://www.virgin.com"
    }, // Los Angeles, CA - Virgin Entertainment
    { 
      location: [51.2254, 6.7832], 
      size: 0.05,
      company: "Virgin Group",
      initiative: "European Operations",
      link: "https://www.virgin.com"
    }, // Dusseldorf, Germany - Virgin operations
    { 
      location: [48.8566, 2.3522], 
      size: 0.07,
      company: "Virgin Group",
      initiative: "European Operations",
      link: "https://www.virgin.com"
    }, // Paris, France - Virgin operations
    { 
      location: [55.6761, 12.5683], 
      size: 0.05,
      company: "Virgin Group",
      initiative: "Nordic Operations",
      link: "https://www.virgin.com"
    }, // Copenhagen, Denmark - Virgin operations
    { 
      location: [52.2297, 21.0122], 
      size: 0.05,
      company: "Virgin Mobile",
      initiative: "Polish Operations",
      link: "https://www.virginmobile.pl"
    }, // Warsaw, Poland - Virgin Mobile
  ]

  return (
    <div className="globe-container">
      <div className="globe-wrapper">
        <World 
          globeConfig={{
            ...globeConfig,
            // Add the Virgin locations as markers
            markers: virginLocations
          }} 
          data={arcData} 
        />
      </div>
    </div>
  );
};

export default GlobeContainer; 