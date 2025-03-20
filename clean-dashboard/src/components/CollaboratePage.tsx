import React, { useState } from 'react';
import TopBar from './TopBar';
import { PROPOSAL_DATA, Proposal } from '../utils/proposalData';
import { COMPANY_DATA } from '../utils/companyData';
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

const EXAMPLE_PROPOSALS = [
  {
    id: '1',
    title: 'Smart Energy Management System',
    category: 'carbon',
    source: 'ai',
    targetCompany: 'Virgin Atlantic',
    description: 'Implement AI-powered energy management system to optimize fuel consumption and reduce carbon emissions across the fleet.',
    potentialImpact: [
      { metric: 'Carbon Reduction', value: '15%' },
      { metric: 'Cost Savings', value: '$2M/year' },
      { metric: 'Efficiency Gain', value: '25%' }
    ],
    votes: 128,
    tags: ['AI', 'Energy', 'Aviation'],
    status: 'active',
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    title: 'Water Recycling Initiative',
    category: 'water',
    source: 'user',
    targetCompany: 'Virgin Hotels',
    description: 'Develop comprehensive water recycling system for hotel operations, including greywater treatment and reuse.',
    potentialImpact: [
      { metric: 'Water Savings', value: '40%' },
      { metric: 'Cost Reduction', value: '$500K/year' }
    ],
    votes: 85,
    tags: ['Water', 'Hotels', 'Recycling'],
    status: 'active',
    createdAt: '2024-03-14'
  },
  {
    id: '3',
    title: 'Biodiversity Conservation Program',
    category: 'biodiversity',
    source: 'ai',
    targetCompany: 'Virgin Voyages',
    description: 'Launch marine conservation program focusing on coral reef protection and marine life preservation in cruise destinations.',
    potentialImpact: [
      { metric: 'Species Protection', value: '50+' },
      { metric: 'Reef Coverage', value: '30% increase' }
    ],
    votes: 156,
    tags: ['Marine', 'Conservation', 'Cruise'],
    status: 'active',
    createdAt: '2024-03-13'
  },
  {
    id: '4',
    title: 'Circular Economy Platform',
    category: 'circular',
    source: 'user',
    targetCompany: 'Virgin Mobile',
    description: 'Create digital platform for device recycling and refurbishment, promoting circular economy in mobile devices.',
    potentialImpact: [
      { metric: 'Device Recycling', value: '1M/year' },
      { metric: 'E-Waste Reduction', value: '60%' }
    ],
    votes: 92,
    tags: ['Recycling', 'Digital', 'Mobile'],
    status: 'active',
    createdAt: '2024-03-12'
  },
  {
    id: '5',
    title: 'Community Solar Initiative',
    category: 'social',
    source: 'ai',
    targetCompany: 'Virgin Money',
    description: 'Develop community solar program providing renewable energy access to underserved communities.',
    potentialImpact: [
      { metric: 'Energy Access', value: '10K households' },
      { metric: 'Job Creation', value: '200+' }
    ],
    votes: 145,
    tags: ['Solar', 'Community', 'Energy'],
    status: 'active',
    createdAt: '2024-03-11'
  }
];

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
  const [activeTab, setActiveTab] = useState<'proposals' | 'collaborate' | 'ideas'>('proposals');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [expandedProposal, setExpandedProposal] = useState<string | null>(null);

  const filteredProposals = EXAMPLE_PROPOSALS.filter(proposal => {
    if (selectedCategory !== 'all' && proposal.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        proposal.title.toLowerCase().includes(query) ||
        proposal.description.toLowerCase().includes(query) ||
        proposal.targetCompany.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const filteredIncentives = INCENTIVE_DATA.filter(incentive => {
    if (selectedCategory !== 'all' && incentive.category !== selectedCategory) {
      return false;
    }
    
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

  const handleVote = (proposalId: string) => {
    // TODO: Implement voting functionality
    console.log('Voted for proposal:', proposalId);
  };

  const handleSubmitProposal = (proposal: Omit<Proposal, 'id' | 'votes' | 'status' | 'createdAt'>) => {
    // TODO: Implement proposal submission
    console.log('New proposal:', proposal);
    setShowIdeaForm(false);
  };

  const toggleProposalExpansion = (proposalId: string) => {
    setExpandedProposal(expandedProposal === proposalId ? null : proposalId);
  };

  return (
    <div className="collaborate-page">
      <div className="top-bar-container">
        <TopBar title="Collaborate" />
      </div>
      
      <div className="collaborate-content">
        <header className="collaborate-header">
          <h1>Environmental Collaboration Hub</h1>
          <p>Connect with partners, share ideas, and find funding opportunities for sustainable initiatives</p>
        </header>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            Proposals
          </button>
          <button 
            className={`tab-btn ${activeTab === 'collaborate' ? 'active' : ''}`}
            onClick={() => setActiveTab('collaborate')}
          >
            Collaborate
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ideas' ? 'active' : ''}`}
            onClick={() => setActiveTab('ideas')}
          >
            Ideas
          </button>
        </div>

        {activeTab === 'collaborate' && (
          <>
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
                        {incentive.criteria.map((criterion: string, index: number) => (
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
          </>
        )}

        {activeTab === 'proposals' && (
          <div className="proposals-section">
            <div className="recommended-container">
              <div className="recommended-section">
                <h2 className="section-title">Recommended Proposals</h2>
                <div className="proposals-grid">
                  {filteredProposals.slice(0, 2).map(proposal => (
                    <div 
                      key={proposal.id} 
                      className={`proposal-card ${proposal.category} ${expandedProposal === proposal.id ? 'expanded' : ''}`}
                      onClick={() => toggleProposalExpansion(proposal.id)}
                    >
                      <div className="proposal-header">
                        <div className="proposal-category">{proposal.category}</div>
                        <div className="proposal-source">{proposal.source === 'ai' ? 'AI Generated' : 'User Proposal'}</div>
                      </div>
                      <h3 className="proposal-title">{proposal.title}</h3>
                      <div className="proposal-company">Target: {proposal.targetCompany}</div>
                      <p className="proposal-description">{proposal.description}</p>
                      
                      <div className="proposal-preview">
                        <div className="proposal-impact">
                          <strong>Potential Impact:</strong>
                          <ul>
                            {proposal.potentialImpact.slice(0, expandedProposal === proposal.id ? undefined : 2).map((impact, index) => (
                              <li key={index}>{impact.metric}: {impact.value}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="proposal-footer">
                          <div className="proposal-votes">
                            <button 
                              className="vote-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(proposal.id);
                              }}
                            >
                              Vote ({proposal.votes})
                            </button>
                          </div>
                          <div className="proposal-tags">
                            {proposal.tags.slice(0, expandedProposal === proposal.id ? undefined : 2).map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="idea-tab">
                <div className="idea-header">
                  <span className="lightbulb-icon">💡</span>
                  <h2>Got an Idea?</h2>
                </div>
                <div className="idea-content">
                  <p className="idea-intro">Every great change starts with an idea</p>
                  <div className="idea-blocks">
                    <div className="idea-block">
                      <div className="idea-block-icon">🎯</div>
                      <div className="idea-block-content">
                        <h3>Small Changes, Big Impact</h3>
                        <p>From quick fixes to efficiency improvements, every idea counts</p>
                      </div>
                    </div>
                    <div className="idea-block">
                      <div className="idea-block-icon">🌱</div>
                      <div className="idea-block-content">
                        <h3>Transformative Solutions</h3>
                        <p>Share your vision for tackling major sustainability challenges</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className="propose-button"
                  onClick={() => setShowIdeaForm(true)}
                >
                  Submit Your Idea
                </button>
              </div>
            </div>

            <div className="all-proposals-container">
              <div className="all-proposals-section">
                <h2 className="section-title">All Proposals</h2>
                <div className="proposals-grid">
                  {filteredProposals.slice(2).map(proposal => (
                    <div 
                      key={proposal.id} 
                      className={`proposal-card ${proposal.category} ${expandedProposal === proposal.id ? 'expanded' : ''}`}
                      onClick={() => toggleProposalExpansion(proposal.id)}
                    >
                      <div className="proposal-header">
                        <div className="proposal-category">{proposal.category}</div>
                        <div className="proposal-source">{proposal.source === 'ai' ? 'AI Generated' : 'User Proposal'}</div>
                      </div>
                      <h3 className="proposal-title">{proposal.title}</h3>
                      <div className="proposal-company">Target: {proposal.targetCompany}</div>
                      <p className="proposal-description">{proposal.description}</p>
                      
                      <div className="proposal-preview">
                        <div className="proposal-impact">
                          <strong>Potential Impact:</strong>
                          <ul>
                            {proposal.potentialImpact.slice(0, expandedProposal === proposal.id ? undefined : 2).map((impact, index) => (
                              <li key={index}>{impact.metric}: {impact.value}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="proposal-footer">
                          <div className="proposal-votes">
                            <button 
                              className="vote-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(proposal.id);
                              }}
                            >
                              Vote ({proposal.votes})
                            </button>
                          </div>
                          <div className="proposal-tags">
                            {proposal.tags.slice(0, expandedProposal === proposal.id ? undefined : 2).map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div className="ideas-section">
            <div className="ideas-grid">
              {/* TODO: Implement ideas grid */}
              <div className="placeholder-message">
                <h3>No ideas found</h3>
                <p>Be the first to propose an idea</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaboratePage; 