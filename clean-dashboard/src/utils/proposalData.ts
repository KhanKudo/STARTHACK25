export interface Proposal {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    company: string;
  };
  targetCompany: string;
  category: 'carbon' | 'water' | 'biodiversity' | 'social' | 'circular';
  potentialImpact: {
    metric: string;
    value: string;
  }[];
  votes: number;
  status: 'active' | 'approved' | 'rejected';
  createdAt: string;
  source: 'user' | 'ai';
  tags: string[];
}

export const PROPOSAL_DATA: Proposal[] = [
  {
    id: 'prop-001',
    title: 'AI-Powered Energy Optimization for Virgin Hotels',
    description: 'Implement AI algorithms to optimize energy usage across Virgin Hotels properties, reducing energy consumption by 25% while maintaining guest comfort.',
    author: {
      id: 'user-001',
      name: 'Sarah Chen',
      company: 'Virgin Hotels'
    },
    targetCompany: 'Virgin Hotels',
    category: 'carbon',
    potentialImpact: [
      { metric: 'Energy Reduction', value: '25%' },
      { metric: 'Cost Savings', value: '$2M/year' },
      { metric: 'CO2 Reduction', value: '1,500 tons/year' }
    ],
    votes: 45,
    status: 'active',
    createdAt: '2024-03-15',
    source: 'user',
    tags: ['AI', 'Energy', 'Hotels', 'Optimization']
  },
  {
    id: 'prop-002',
    title: 'Circular Economy Initiative for Virgin Atlantic',
    description: 'Develop a comprehensive circular economy program for Virgin Atlantic, focusing on waste reduction, recycling, and sustainable materials in aircraft operations.',
    author: {
      id: 'ai-001',
      name: 'AI Assistant',
      company: 'Virgin Atlantic'
    },
    targetCompany: 'Virgin Atlantic',
    category: 'circular',
    potentialImpact: [
      { metric: 'Waste Reduction', value: '40%' },
      { metric: 'Recycling Rate', value: '85%' },
      { metric: 'Cost Savings', value: '$1.5M/year' }
    ],
    votes: 32,
    status: 'active',
    createdAt: '2024-03-14',
    source: 'ai',
    tags: ['Circular Economy', 'Aviation', 'Waste Management']
  }
]; 