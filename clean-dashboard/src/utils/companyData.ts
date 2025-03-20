export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  sustainabilityMetrics: {
    carbonEmissions: string;
    waterUsage: string;
    wasteManagement: string;
    renewableEnergy: string;
  };
  currentInitiatives: string[];
  location: string;
  size: string;
  virginGroup: boolean;
}

export const COMPANY_DATA: Company[] = [
  {
    id: 'comp-001',
    name: 'Virgin Hotels',
    description: 'Luxury hotel chain focused on sustainable hospitality and guest experience.',
    industry: 'Hospitality',
    sustainabilityMetrics: {
      carbonEmissions: '2.5 tons CO2e/room/year',
      waterUsage: '150L/guest/day',
      wasteManagement: '65% recycling rate',
      renewableEnergy: '40% renewable energy usage'
    },
    currentInitiatives: [
      'Zero single-use plastics',
      'Smart energy management',
      'Local sourcing program'
    ],
    location: 'Global',
    size: '5000+ employees',
    virginGroup: true
  },
  {
    id: 'comp-002',
    name: 'Virgin Atlantic',
    description: 'International airline committed to sustainable aviation and reducing carbon footprint.',
    industry: 'Aviation',
    sustainabilityMetrics: {
      carbonEmissions: '95g CO2e/passenger/km',
      waterUsage: '2.5L/passenger',
      wasteManagement: '75% recycling rate',
      renewableEnergy: '25% SAF usage'
    },
    currentInitiatives: [
      'Sustainable Aviation Fuel program',
      'Single-use plastics reduction',
      'Carbon offset program'
    ],
    location: 'UK-based, Global operations',
    size: '8000+ employees',
    virginGroup: true
  },
  {
    id: 'comp-003',
    name: 'Virgin Galactic',
    description: 'Space tourism company focused on sustainable space travel and research.',
    industry: 'Space',
    sustainabilityMetrics: {
      carbonEmissions: 'Under review',
      waterUsage: 'Under review',
      wasteManagement: 'Under review',
      renewableEnergy: 'Under review'
    },
    currentInitiatives: [
      'Sustainable propulsion research',
      'Environmental impact assessment',
      'Space debris mitigation'
    ],
    location: 'USA',
    size: '1000+ employees',
    virginGroup: true
  }
]; 