import React, { useState } from 'react';
import TopBar from './TopBar';
import './CollaboratePage.css';

interface IncentiveCard {
  id: string;
  title: string;
  organization: string;
  description: string;
  criteria: string[];
  fundingAvailable: string;
  deadline: string;
  category: 'carbon' | 'water' | 'biodiversity' | 'social' | 'circular';
  imageUrl: string;
}

const INCENTIVE_DATA: IncentiveCard[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1974&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?q=80&w=1974&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1972&auto=format&fit=crop'
  }
];

const CollaboratePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncentives = INCENTIVE_DATA.filter(incentive => {
    // Filter by category
    if (selectedCategory !== 'all' && incentive.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        incentive.title.toLowerCase().includes(query) ||
        incentive.description.toLowerCase().includes(query) ||
        incentive.organization.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="collaborate-page">
      <div className="top-bar-container">
        <TopBar title="Collaborate" />
      </div>
      
      <div className="collaborate-content">
        <header className="collaborate-header">
          <h1>Find Collaboration Opportunities</h1>
          <p>Connect with organizations offering incentives for environmentally beneficial projects</p>
        </header>
        
        <div className="filters-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search opportunities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="category-filters">
            <button 
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button 
              className={`category-btn carbon ${selectedCategory === 'carbon' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('carbon')}
            >
              Carbon
            </button>
            <button 
              className={`category-btn water ${selectedCategory === 'water' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('water')}
            >
              Water
            </button>
            <button 
              className={`category-btn biodiversity ${selectedCategory === 'biodiversity' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('biodiversity')}
            >
              Biodiversity
            </button>
            <button 
              className={`category-btn circular ${selectedCategory === 'circular' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('circular')}
            >
              Circular Economy
            </button>
            <button 
              className={`category-btn social ${selectedCategory === 'social' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('social')}
            >
              Social Impact
            </button>
          </div>
        </div>
        
        <div className="incentives-grid">
          {filteredIncentives.map(incentive => (
            <div key={incentive.id} className={`incentive-card ${incentive.category}`}>
              <div className="incentive-image" style={{ backgroundImage: `url(${incentive.imageUrl})` }}></div>
              <div className="incentive-content">
                <div className="incentive-category">{incentive.category}</div>
                <h3 className="incentive-title">{incentive.title}</h3>
                <div className="incentive-organization">{incentive.organization}</div>
                <p className="incentive-description">{incentive.description}</p>
                
                <div className="incentive-details">
                  <div className="incentive-funding">
                    <strong>Funding:</strong> {incentive.fundingAvailable}
                  </div>
                  <div className="incentive-deadline">
                    <strong>Deadline:</strong> {incentive.deadline}
                  </div>
                </div>
                
                <div className="incentive-criteria">
                  <strong>Key Criteria:</strong>
                  <ul>
                    {incentive.criteria.map((criterion, index) => (
                      <li key={index}>{criterion}</li>
                    ))}
                  </ul>
                </div>
                
                <button className="apply-button">Apply for Collaboration</button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredIncentives.length === 0 && (
          <div className="no-results">
            <h3>No collaboration opportunities found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
        
        <div className="propose-container">
          <h2>Have an Idea?</h2>
          <p>Propose your own environmental collaboration initiative and find partners</p>
          <button className="propose-button">Propose Initiative</button>
        </div>
      </div>
    </div>
  );
};

export default CollaboratePage; 