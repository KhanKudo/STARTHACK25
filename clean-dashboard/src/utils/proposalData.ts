export interface Proposal {
  id: string;
  title: string;
  company: string;
  category: 'carbon' | 'water' | 'biodiversity' | 'social' | 'circular';
  description: string;
  impact: {
    metric: string;
    value: string;
  }[];
  tags: string[];
  votes: number;
  isRecommended: boolean;
  source: 'user' | 'ai';
  createdAt: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export const EXAMPLE_PROPOSALS: Proposal[] = [
  {
    id: 'carbon-reduction-1',
    title: 'Smart Energy Management System',
    company: 'Virgin Atlantic',
    category: 'carbon',
    description: 'Implement AI-powered energy management system to optimize fuel consumption and reduce carbon emissions across the fleet.',
    impact: [
      { metric: 'Carbon Reduction', value: '15%' },
      { metric: 'Cost Savings', value: '$2M/year' }
    ],
    tags: ['AI', 'Energy', 'Fleet Operations'],
    votes: 45,
    isRecommended: true,
    source: 'ai',
    createdAt: '2024-02-15',
    status: 'active'
  },
  {
    id: 'water-conservation-1',
    title: 'Water Recycling Initiative',
    company: 'Virgin Hotels',
    category: 'water',
    description: 'Develop and implement a comprehensive water recycling system for hotel operations, including greywater reuse and rainwater harvesting.',
    impact: [
      { metric: 'Water Savings', value: '40%' },
      { metric: 'Cost Reduction', value: '$500K/year' }
    ],
    tags: ['Recycling', 'Hotels', 'Water Management'],
    votes: 38,
    isRecommended: true,
    source: 'ai',
    createdAt: '2024-02-14',
    status: 'active'
  },
  {
    id: 'biodiversity-1',
    title: 'Coral Reef Restoration Project',
    company: 'Virgin Limited Edition',
    category: 'biodiversity',
    description: 'Partner with marine conservation organizations to restore and protect coral reefs near Virgin Limited Edition properties.',
    impact: [
      { metric: 'Reef Coverage', value: '+25%' },
      { metric: 'Species Diversity', value: '+15%' }
    ],
    tags: ['Marine', 'Conservation', 'Tourism'],
    votes: 32,
    isRecommended: false,
    source: 'user',
    createdAt: '2024-02-13',
    status: 'active'
  },
  {
    id: 'circular-1',
    title: 'Zero-Waste Supply Chain',
    company: 'Virgin Wines',
    category: 'circular',
    description: 'Transform the wine supply chain to achieve zero waste through innovative packaging and distribution methods.',
    impact: [
      { metric: 'Waste Reduction', value: '95%' },
      { metric: 'Packaging Costs', value: '-30%' }
    ],
    tags: ['Supply Chain', 'Packaging', 'Wine'],
    votes: 28,
    isRecommended: false,
    source: 'ai',
    createdAt: '2024-02-12',
    status: 'active'
  },
  {
    id: 'social-1',
    title: 'Community Solar Initiative',
    company: 'Virgin Money',
    category: 'social',
    description: 'Launch a community solar program to provide renewable energy access to underserved communities.',
    impact: [
      { metric: 'Energy Access', value: '1000+ homes' },
      { metric: 'Job Creation', value: '50+ jobs' }
    ],
    tags: ['Solar', 'Community', 'Energy Access'],
    votes: 42,
    isRecommended: true,
    source: 'user',
    createdAt: '2024-02-11',
    status: 'active'
  },
  {
    id: 'carbon-reduction-2',
    title: 'Sustainable Aviation Fuel Program',
    company: 'Virgin Atlantic',
    category: 'carbon',
    description: 'Develop and implement a comprehensive SAF program to reduce aviation emissions.',
    impact: [
      { metric: 'Carbon Reduction', value: '70%' },
      { metric: 'SAF Usage', value: '10%' }
    ],
    tags: ['Aviation', 'Fuel', 'Innovation'],
    votes: 35,
    isRecommended: false,
    source: 'ai',
    createdAt: '2024-02-10',
    status: 'active'
  }
]; 