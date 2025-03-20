import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import { EXAMPLE_PROPOSALS, Proposal } from '../utils/proposalData';
import { COMPANY_DATA } from '../utils/companyData';
import SubmitIdeaForm from './SubmitIdeaForm';
import SmallChangesForm, { SmallChangesData } from './SmallChangesForm';
import TransformativeForm, { TransformativeData } from './TransformativeForm';
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
  const [activeTab, setActiveTab] = useState<'proposals' | 'collaboration'>('proposals');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [expandedProposal, setExpandedProposal] = useState<string | null>(null);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [isSmallChangesFormOpen, setIsSmallChangesFormOpen] = useState(false);
  const [isTransformativeFormOpen, setIsTransformativeFormOpen] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>(EXAMPLE_PROPOSALS);
  const [votedProposals, setVotedProposals] = useState<string[]>([]);

  // Load voted proposals from localStorage on component mount
  useEffect(() => {
    const savedVotes = localStorage.getItem('votedProposals');
    if (savedVotes) {
      setVotedProposals(JSON.parse(savedVotes));
    }
  }, []);

  const recommendedProposals = proposals
    .filter(proposal => proposal.isRecommended)
    .slice(0, 2);
  const allProposals = proposals.filter(proposal => !proposal.isRecommended);

  const filteredProposals = proposals.filter(proposal => {
    if (selectedCategory !== 'all' && proposal.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        proposal.title.toLowerCase().includes(query) ||
        proposal.description.toLowerCase().includes(query) ||
        proposal.company.toLowerCase().includes(query)
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
    // Check if user has already voted on this proposal
    if (votedProposals.includes(proposalId)) {
      return; // Already voted, do nothing
    }

    // Update proposals with incremented vote count
    const updatedProposals = proposals.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, votes: proposal.votes + 1 } 
        : proposal
    );
    
    // Update voted proposals array
    const newVotedProposals = [...votedProposals, proposalId];
    
    // Save to state and localStorage
    setProposals(updatedProposals);
    setVotedProposals(newVotedProposals);
    localStorage.setItem('votedProposals', JSON.stringify(newVotedProposals));
  };

  const handleSubmitProposal = (proposal: Omit<Proposal, 'id' | 'votes' | 'status' | 'createdAt'>) => {
    // TODO: Implement proposal submission
    console.log('New proposal:', proposal);
    setShowIdeaForm(false);
  };

  const toggleProposalExpansion = (proposalId: string) => {
    setExpandedProposal(expandedProposal === proposalId ? null : proposalId);
  };

  const handleSubmitIdea = (newIdea: Omit<Proposal, 'id' | 'votes' | 'status' | 'createdAt' | 'source'>) => {
    const proposal: Proposal = {
      ...newIdea,
      id: `proposal-${Date.now()}`,
      votes: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      source: 'user',
      isRecommended: false
    };
    setProposals(prev => [...prev, proposal]);
  };

  const handleSmallChangesSubmit = (data: SmallChangesData) => {
    const proposal: Proposal = {
      id: `proposal-${Date.now()}`,
      title: data.title,
      description: data.description,
      company: 'Your Company', // Default placeholder
      category: 'carbon', // Using an allowed category
      impact: [{
        metric: 'Efficiency',
        value: data.estimatedImpact
      }],
      tags: [data.targetArea, data.implementationTime],
      votes: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      source: 'user',
      isRecommended: false
    };
    setProposals(prev => [...prev, proposal]);
    setIsSmallChangesFormOpen(false);
  };

  const handleTransformativeSubmit = (data: TransformativeData) => {
    const proposal: Proposal = {
      id: `proposal-${Date.now()}`,
      title: data.title,
      description: data.description + '\n\nChallenge: ' + data.challenge + '\n\nSolution: ' + data.potentialSolution,
      company: 'Cross-Industry', // Transformative solutions often span multiple companies
      category: 'biodiversity', // Using an allowed category
      impact: [{
        metric: 'Sustainability Impact',
        value: data.expectedImpact
      }],
      tags: ['transformative', data.timeToImplement, 'collaboration'],
      votes: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      source: 'user',
      isRecommended: false
    };
    setProposals(prev => [...prev, proposal]);
    setIsTransformativeFormOpen(false);
  };

  return (
    <div className="collaborate-page">
      <div className="top-bar-container">
        <TopBar title="Collaborate" />
      </div>
      
      <div className="collaborate-content-container">
        <div className="collaborate-content">
          <a href="/dashboard" className="back-to-dashboard">← Back to Dashboard</a>
          
          <header className="collaborate-header">
            <h1>Environmental Collaboration Hub</h1>
            <p>Connect with partners, share ideas, and find funding opportunities for sustainable initiatives</p>
          </header>
          
          <div className="idea-tab">
            <div className="idea-header">
              <h2>Got an Idea?</h2>
            </div>
            <div className="idea-content">
              <p className="idea-intro">Every great change starts with an idea</p>
              <div className="idea-blocks">
                <div 
                  className="idea-block clickable"
                  onClick={() => setIsSmallChangesFormOpen(true)}
                >
                  <div className="idea-block-icon">🎯</div>
                  <div className="idea-block-content">
                    <h3>Small Changes, Big Impact</h3>
                    <p>From quick fixes to efficiency improvements, every idea counts</p>
                  </div>
                </div>
                <div 
                  className="idea-block clickable"
                  onClick={() => setIsTransformativeFormOpen(true)}
                >
                  <div className="idea-block-icon">🌱</div>
                  <div className="idea-block-content">
                    <h3>Transformative Solutions</h3>
                    <p>Share your vision for tackling major sustainability challenges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
              onClick={() => setActiveTab('proposals')}
            >
              Proposals
            </button>
            <button 
              className={`tab-btn ${activeTab === 'collaboration' ? 'active' : ''}`}
              onClick={() => setActiveTab('collaboration')}
            >
              Collaboration
            </button>
          </div>

          {activeTab === 'proposals' && (
            <div className="proposals-section">
              <div className="recommended-section">
                <h2 className="section-title">Recommended Proposals</h2>
                <div className="proposals-grid">
                  {recommendedProposals.map(proposal => (
                    <div 
                      key={proposal.id} 
                      className={`proposal-card ${proposal.category}`}
                    >
                      <div className="proposal-header">
                        <div className="proposal-category">{proposal.category}</div>
                        <div className="proposal-source">{proposal.source === 'ai' ? 'AI Generated' : 'User Generated'}</div>
                      </div>
                      <h3 className="proposal-title">{proposal.title}</h3>
                      <div className="proposal-company">Target: {proposal.company}</div>
                      <p className="proposal-description">{proposal.description}</p>
                      
                      <div className="proposal-preview">
                        <div className="proposal-impact">
                          <strong>Potential Impact:</strong>
                          <ul>
                            {proposal.impact.map((impact, index) => (
                              <li key={index}>{impact.metric}: {impact.value}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="proposal-footer">
                          <div className="proposal-votes">
                            <button 
                              className={`vote-button ${votedProposals.includes(proposal.id) ? 'voted' : ''}`}
                              onClick={() => handleVote(proposal.id)}
                              disabled={votedProposals.includes(proposal.id)}
                            >
                              {votedProposals.includes(proposal.id) ? 'Voted' : 'Vote'} ({proposal.votes})
                            </button>
                          </div>
                          <div className="proposal-tags">
                            {proposal.tags.map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="all-proposals-section">
                <h2 className="section-title">All Proposals</h2>
                <div className="proposals-grid">
                  {allProposals.map(proposal => (
                    <div 
                      key={proposal.id} 
                      className={`proposal-card ${proposal.category}`}
                    >
                      <div className="proposal-header">
                        <div className="proposal-category">{proposal.category}</div>
                        <div className="proposal-source">{proposal.source === 'ai' ? 'AI Generated' : 'User Generated'}</div>
                      </div>
                      <h3 className="proposal-title">{proposal.title}</h3>
                      <div className="proposal-company">Target: {proposal.company}</div>
                      <p className="proposal-description">{proposal.description}</p>
                      
                      <div className="proposal-preview">
                        <div className="proposal-impact">
                          <strong>Potential Impact:</strong>
                          <ul>
                            {proposal.impact.map((impact, index) => (
                              <li key={index}>{impact.metric}: {impact.value}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="proposal-footer">
                          <div className="proposal-votes">
                            <button 
                              className={`vote-button ${votedProposals.includes(proposal.id) ? 'voted' : ''}`}
                              onClick={() => handleVote(proposal.id)}
                              disabled={votedProposals.includes(proposal.id)}
                            >
                              {votedProposals.includes(proposal.id) ? 'Voted' : 'Vote'} ({proposal.votes})
                            </button>
                          </div>
                          <div className="proposal-tags">
                            {proposal.tags.map(tag => (
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
          )}

          {activeTab === 'collaboration' && (
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
        </div>
      </div>

      <SubmitIdeaForm
        isOpen={isSubmitFormOpen}
        onClose={() => setIsSubmitFormOpen(false)}
        onSubmit={handleSubmitIdea}
      />

      <SmallChangesForm 
        isOpen={isSmallChangesFormOpen}
        onClose={() => setIsSmallChangesFormOpen(false)}
        onSubmit={handleSmallChangesSubmit}
      />

      <TransformativeForm
        isOpen={isTransformativeFormOpen}
        onClose={() => setIsTransformativeFormOpen(false)}
        onSubmit={handleTransformativeSubmit}
      />
    </div>
  );
};

export default CollaboratePage; 