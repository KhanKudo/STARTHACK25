import { COMPANY_DATA } from './companyData';

export interface CollaborationOpportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  criteria: string[];
  fundingAvailable: string;
  deadline: string;
  category: 'carbon' | 'water' | 'biodiversity' | 'social' | 'circular';
  imageUrl: string;
  companies: string[]; // List of company IDs involved in the collaboration
  source: 'static' | 'ai';
}

// Simple API object for working with collaboration opportunities
export const api = {
  getAllOpportunities: async (): Promise<CollaborationOpportunity[]> => {
    // Simulating API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(collaborationData), 800);
    });
  },

  getOpportunityById: async (id: string): Promise<CollaborationOpportunity | undefined> => {
    // Simulating API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(getOpportunityById(id)), 500);
    });
  },

  addOpportunity: async (opportunity: Omit<CollaborationOpportunity, 'id'>): Promise<CollaborationOpportunity> => {
    // Simulating API call with a delay
    return new Promise((resolve) => {
      const newOpportunity = addOpportunity(opportunity);
      setTimeout(() => resolve(newOpportunity), 500);
    });
  }
};

// Helper function to get opportunity by ID
export const getOpportunityById = (id: string): CollaborationOpportunity | undefined => {
  return collaborationData.find(opportunity => opportunity.id === id);
};

// Helper function to add a new opportunity
export const addOpportunity = (opportunity: Omit<CollaborationOpportunity, 'id'>): CollaborationOpportunity => {
  // Generate ID from organization and title (simplified slug)
  const slug = opportunity.organization
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .substring(0, 10);

  // Generate a unique ID
  const timestamp = Date.now().toString(36);
  const id = `${slug}-collab-${timestamp}`;

  // Create the new opportunity with the ID
  const newOpportunity: CollaborationOpportunity = {
    id,
    ...opportunity
  };

  // Add to the beginning of the array
  collaborationData.unshift(newOpportunity);

  return newOpportunity;
};

// Export the collaboration opportunities array - initially populated with some static data
export const collaborationData: CollaborationOpportunity[] = [
  {
    id: 'carbon-reduction',
    title: 'Carbon Reduction Partnership',
    organization: 'Climate Innovation Fund',
    description: 'Funding for collaborative projects that significantly reduce carbon emissions across multiple industries.',
    criteria: [
      'Minimum 20% carbon reduction',
      'Cross-industry collaboration',
      'Measurable impact within 2 years',
      'Scalable solution'
    ],
    fundingAvailable: '$100,000 - $500,000',
    deadline: 'June 30, 2024',
    category: 'carbon',
    imageUrl: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop',
    companies: ['virgin-atlantic', 'virgin-hotels'],
    source: 'static'
  },
  {
    id: 'water-conservation',
    title: 'Water Conservation Initiative',
    organization: 'Global Water Alliance',
    description: 'Supporting innovative partnerships that develop new technologies or approaches to water conservation.',
    criteria: [
      'Reduce water usage by 30%',
      'Cross-sector approach',
      'Technology-enabled solution',
      'Implementation plan'
    ],
    fundingAvailable: '$75,000 - $250,000',
    deadline: 'August 15, 2024',
    category: 'water',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1974&auto=format&fit=crop',
    companies: ['virgin-hotels', 'virgin-limited-edition'],
    source: 'static'
  },
  {
    id: 'biodiversity-protection',
    title: 'Biodiversity Protection Coalition',
    organization: 'Natural Habitats Foundation',
    description: 'Encouraging companies to collaborate on projects that protect biodiversity while maintaining business operations.',
    criteria: [
      'Biodiversity net gain',
      'Multi-stakeholder approach',
      'Long-term sustainability',
      'Community involvement'
    ],
    fundingAvailable: '$150,000 - $350,000',
    deadline: 'July 31, 2024',
    category: 'biodiversity',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop',
    companies: ['virgin-limited-edition', 'virgin-wines'],
    source: 'static'
  },
  {
    id: 'circular-economy',
    title: 'Circular Economy Accelerator',
    organization: 'Virgin Unite',
    description: 'Supporting partnerships that create circular business models across supply chains to reduce waste and resource use.',
    criteria: [
      'Waste reduction metrics',
      'Supply chain collaboration',
      'Innovative business model',
      'Economic viability'
    ],
    fundingAvailable: '$200,000 - $400,000',
    deadline: 'September 30, 2024',
    category: 'circular',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
    companies: ['virgin-wines', 'virgin-atlantic'],
    source: 'static'
  },
  {
    id: 'community-impact',
    title: 'Community Environmental Justice',
    organization: 'Social Impact Collaborative',
    description: 'Funding for projects that address environmental challenges while creating positive social outcomes in underserved communities.',
    criteria: [
      'Environmental and social metrics',
      'Community co-creation',
      'Sustainable impact',
      'Replicable model'
    ],
    fundingAvailable: '$125,000 - $300,000',
    deadline: 'October 15, 2024',
    category: 'social',
    imageUrl: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?q=80&w=1974&auto=format&fit=crop',
    companies: ['virgin-money', 'virgin-hotels'],
    source: 'static'
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Innovation',
    organization: 'Clean Energy Consortium',
    description: 'Supporting collaborative projects that develop or implement innovative renewable energy solutions.',
    criteria: [
      'Technology innovation',
      'Cross-industry application',
      'Emissions reduction potential',
      'Commercial viability'
    ],
    fundingAvailable: '$250,000 - $750,000',
    deadline: 'August 31, 2024',
    category: 'carbon',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1972&auto=format&fit=crop',
    companies: ['virgin-atlantic', 'virgin-money'],
    source: 'static'
  }
]; 