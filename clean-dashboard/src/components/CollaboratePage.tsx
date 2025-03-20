import React, { useState, useEffect, useRef } from 'react';
import TopBar from './TopBar';
import { proposalData, Proposal } from '../utils/proposalData';
import { COMPANY_DATA } from '../utils/companyData';
import { projectData } from '../utils/projectData';
import { generateAIProposals } from '../services/proposalGenerator';
import { collaborationData, CollaborationOpportunity } from '../utils/collaborationData';
import { generateCollaborationOpportunities } from '../services/collaborationGenerator';
import SubmitIdeaForm from './SubmitIdeaForm';
import SmallChangesForm, { SmallChangesData } from './SmallChangesForm';
import TransformativeForm, { TransformativeData } from './TransformativeForm';
import './CollaboratePage.css';

const CollaboratePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'collaboration'>('proposals');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [expandedProposal, setExpandedProposal] = useState<Proposal | null>(null);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [isSmallChangesFormOpen, setIsSmallChangesFormOpen] = useState(false);
  const [isTransformativeFormOpen, setIsTransformativeFormOpen] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>(proposalData);
  const [collaborations, setCollaborations] = useState<CollaborationOpportunity[]>(collaborationData);
  const [votedProposals, setVotedProposals] = useState<string[]>([]);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [isGeneratingCollaboration, setIsGeneratingCollaboration] = useState(false);
  const proposalIntervalRef = useRef<number | null>(null);
  const collaborationIntervalRef = useRef<number | null>(null);
  const [expandedCollaboration, setExpandedCollaboration] = useState<CollaborationOpportunity | null>(null);
  const [selectedCollaboration, setSelectedCollaboration] = useState<CollaborationOpportunity | null>(null);

  // Load voted proposals from localStorage on component mount
  useEffect(() => {
    const savedVotes = localStorage.getItem('votedProposals');
    if (savedVotes) {
      setVotedProposals(JSON.parse(savedVotes));
    }
    
    // Start the interval for automatic proposal generation
    proposalIntervalRef.current = window.setInterval(() => {
      generateProposalInBackground();
    }, 150000); // Run every 150 seconds (2.5 minutes)
    
    // Start the interval for automatic collaboration opportunity generation
    collaborationIntervalRef.current = window.setInterval(() => {
      generateCollaborationInBackground();
    }, 180000); // Run every 180 seconds (3 minutes)
    
    // Generate one proposal and one collaboration immediately on component mount
    generateProposalInBackground();
    generateCollaborationInBackground();
    
    // Clean up the intervals when the component unmounts
    return () => {
      if (proposalIntervalRef.current !== null) {
        window.clearInterval(proposalIntervalRef.current);
      }
      if (collaborationIntervalRef.current !== null) {
        window.clearInterval(collaborationIntervalRef.current);
      }
    };
  }, []);

  // Function to generate a proposal in the background
  const generateProposalInBackground = async () => {
    // Prevent multiple simultaneous generations
    if (isGeneratingProposal) return;
    
    try {
      setIsGeneratingProposal(true);
      
      // Get a random subset of projects (1-3) for more focused proposals
      const randomProjects = getRandomSubset(projectData, Math.floor(Math.random() * 3) + 1);
      
      // Get a random company to focus on
      const randomCompany = COMPANY_DATA[Math.floor(Math.random() * COMPANY_DATA.length)];
      
      console.log('Generating new AI proposal...');
      
      // Random enthusiasm descriptors to make descriptions more lively
      const enthusiasmPrefixes = [
        "Exciting opportunity to", 
        "Revolutionary approach to", 
        "Game-changing initiative for", 
        "Innovative strategy to", 
        "Groundbreaking method for"
      ];
      
      // Random impact phrases to make descriptions more engaging
      const impactPhrases = [
        "dramatically transform", 
        "fundamentally reimagine", 
        "substantially improve", 
        "radically enhance", 
        "powerfully accelerate"
      ];
      
      // Ensure we get varied categories by randomizing
      const categories: Array<'carbon' | 'water' | 'biodiversity' | 'social' | 'circular'> = [
        'carbon', 'water', 'biodiversity', 'social', 'circular'
      ];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Generate the proposal
      const generatedProposals = await generateAIProposals({
        companies: [randomCompany],
        projects: randomProjects
      });
      
      // Update the state with the new proposals
      if (generatedProposals.length > 0) {
        console.log('New proposals generated:', generatedProposals);
        
        // Enhance the proposals with more lively descriptions and varied categories
        // and ensure they have all required Proposal fields
        const enhancedProposals: Proposal[] = generatedProposals.map(proposal => {
          const prefix = enthusiasmPrefixes[Math.floor(Math.random() * enthusiasmPrefixes.length)];
          const impact = impactPhrases[Math.floor(Math.random() * impactPhrases.length)];
          
          // Don't modify existing AI-generated descriptions if they're already good
          let enhancedDescription = proposal.description;
          if (!enhancedDescription.includes(prefix) && !enhancedDescription.includes(impact)) {
            enhancedDescription = `${prefix} ${enhancedDescription.toLowerCase()}. This will ${impact} sustainability efforts in the sector.`;
          }
          
          return {
            ...proposal,
            id: `ai-proposal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            votes: 0,
            status: 'active' as const,
            createdAt: new Date().toISOString(),
            description: enhancedDescription,
            category: randomCategory,
            isRecommended: false
          };
        });
        
        // Now update with the enhanced proposals
        setProposals(currentProposals => [...currentProposals, ...enhancedProposals]);
      }
    } catch (error) {
      console.error('Error generating proposal:', error);
    } finally {
      setIsGeneratingProposal(false);
    }
  };
  
  // Function to generate a collaboration opportunity in the background
  const generateCollaborationInBackground = async () => {
    // Prevent multiple simultaneous generations
    if (isGeneratingCollaboration) return;
    
    try {
      setIsGeneratingCollaboration(true);
      console.log('Generating new collaboration opportunity...');
      
      // Generate the collaboration opportunity
      const generatedCollaborations = await generateCollaborationOpportunities();
      
      // Update the state with the new collaborations
      if (generatedCollaborations.length > 0) {
        console.log('New collaboration opportunities generated:', generatedCollaborations);
        setCollaborations(currentCollaborations => [...currentCollaborations, ...generatedCollaborations]);
      }
    } catch (error) {
      console.error('Error generating collaboration opportunity:', error);
    } finally {
      setIsGeneratingCollaboration(false);
    }
  };
  
  // Helper function to get a random subset of an array
  const getRandomSubset = <T,>(array: T[], size: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(size, array.length));
  };

  // Get recommended proposals based on most votes instead of isRecommended flag
  const recommendedProposals = [...proposals]
    .sort((a, b) => b.votes - a.votes) // Sort by votes in descending order
    .slice(0, 2); // Take top 2 with most votes
  
  const allProposals = proposals.filter(p => 
    !recommendedProposals.some(rp => rp.id === p.id)
  );

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

  const filteredIncentives = collaborations.filter(collaboration => {
    if (selectedCategory !== 'all' && collaboration.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        collaboration.title.toLowerCase().includes(query) ||
        collaboration.description.toLowerCase().includes(query) ||
        collaboration.organization.toLowerCase().includes(query)
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

  const handleViewProposalDetails = (proposal: Proposal) => {
    setExpandedProposal(proposal);
    // Add overflow hidden to body to prevent scrolling behind the modal
    document.body.style.overflow = 'hidden';
  };

  const handleCloseProposalDetails = () => {
    setExpandedProposal(null);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
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

  // Add this button to manually trigger generation for testing
  const handleManualGenerate = () => {
    generateProposalInBackground();
  };

  const handleViewCollaborationDetails = (collaboration: CollaborationOpportunity) => {
    setExpandedCollaboration(collaboration);
    // Add overflow hidden to body to prevent scrolling behind the modal
    document.body.style.overflow = 'hidden';
  };

  const handleCloseCollaborationDetails = () => {
    setExpandedCollaboration(null);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };

  // Function to show only first two lines of text
  const getPreviewText = (text: string) => {
    const lines = text.split('\n');
    const firstTwoLines = lines.slice(0, 2).join('\n');
    return firstTwoLines + (lines.length > 2 ? '...' : '');
  };

  const handleCollaborateButtonClick = (e: React.MouseEvent, collaboration: CollaborationOpportunity) => {
    e.stopPropagation(); // Prevent triggering the card click (expand details)
    setSelectedCollaboration(collaboration);
  };

  const handleCloseCollaborationForm = () => {
    setSelectedCollaboration(null);
  };

  const styles = {
    description: {
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical' as any,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: '10px'
    },
    applyButton: {
      backgroundColor: '#e30613', // Virgin red color
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginTop: '10px'
    }
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
            <p>Share ideas, team up with partners, and find resources for sustainable projects</p>
          </header>
          
          <div className="idea-tab">
            <div className="idea-header">
              <h2>Got an Idea?</h2>
            </div>
            <div className="idea-content">
              <p className="idea-intro">Everyone can make a difference</p>
              <div className="idea-blocks">
                <div 
                  className="idea-block clickable"
                  onClick={() => setIsSmallChangesFormOpen(true)}
                >
                  <div className="idea-block-icon">🎯</div>
                  <div className="idea-block-content">
                    <h3>Small Changes, Big Impact</h3>
                    <p>Quick fixes and smart improvements that add up</p>
                  </div>
                </div>
                <div 
                  className="idea-block clickable"
                  onClick={() => setIsTransformativeFormOpen(true)}
                >
                  <div className="idea-block-icon">🌱</div>
                  <div className="idea-block-content">
                    <h3>Transformative Solutions</h3>
                    <p>Share your big ideas for tough sustainability challenges</p>
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
                      onClick={() => handleViewProposalDetails(proposal)}
                    >
                      <div className="proposal-header">
                        <div className="proposal-category">{proposal.category}</div>
                        <div className="proposal-source">{proposal.source === 'ai' ? 'AI Generated' : 'User Generated'}</div>
                      </div>
                      <h3 className="proposal-title">{proposal.title}</h3>
                      <div className="proposal-company">Target: {proposal.company}</div>
                      <p className="proposal-description" style={styles.description}>{proposal.description}</p>
                      
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
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent opening the modal when clicking the vote button
                                handleVote(proposal.id);
                              }}
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
                      onClick={() => handleViewProposalDetails(proposal)}
                    >
                      <div className="proposal-header">
                        <div className="proposal-category">{proposal.category}</div>
                        <div className="proposal-source">{proposal.source === 'ai' ? 'AI Generated' : 'User Generated'}</div>
                      </div>
                      <h3 className="proposal-title">{proposal.title}</h3>
                      <div className="proposal-company">Target: {proposal.company}</div>
                      <p className="proposal-description" style={styles.description}>{proposal.description}</p>
                      
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
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent opening the modal when clicking the vote button
                                handleVote(proposal.id);
                              }}
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
                {filteredIncentives.map(collaboration => (
                  <div 
                    key={collaboration.id} 
                    className={`incentive-card ${collaboration.category}`}
                    onClick={() => handleViewCollaborationDetails(collaboration)}
                  >
                    <div className="incentive-image" style={{ backgroundImage: `url(${collaboration.imageUrl})` }}></div>
                    <div className="incentive-content">
                      <div className="incentive-category">{collaboration.category}</div>
                      {collaboration.source === 'ai' && 
                        <div className="collaboration-source" style={{
                          fontSize: '12px',
                          color: '#777',
                          background: '#f0f0f0',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginLeft: '8px'
                        }}>AI Generated</div>
                      }
                      <h3 className="incentive-title">{collaboration.title}</h3>
                      <div className="incentive-org">
                        {collaboration.companies.map(companyId => {
                          const company = COMPANY_DATA.find(c => c.id === companyId);
                          return company ? company.name : '';
                        }).filter(Boolean).join(' & ')}
                      </div>
                      <p className="incentive-description" style={styles.description}>{getPreviewText(collaboration.description)}</p>
                      
                      <div className="incentive-preview-notice" style={{
                        fontSize: '12px',
                        color: '#666',
                        fontStyle: 'italic',
                        marginTop: '8px',
                        textAlign: 'center'
                      }}>Click to view more details</div>
                      
                      <button 
                        className="collaborate-button"
                        onClick={(e) => handleCollaborateButtonClick(e, collaboration)}
                        style={styles.applyButton}
                      >
                        Apply for Collaboration
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredIncentives.length === 0 && (
                <div className="no-results">
                  <h3>No collaboration opportunities found</h3>
                  <p>Try adjusting your filters or search</p>
                </div>
              )}
              
              <div className="propose-container">
                <h2>Have an Idea?</h2>
                <p>Share your idea and find people to work with</p>
                <button className="propose-button">Propose Initiative</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Expanded Proposal Modal */}
      {expandedProposal && (
        <div className="modal-overlay" onClick={handleCloseProposalDetails}>
          <div className="expanded-proposal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseProposalDetails}>×</button>
            
            <div className="proposal-header">
              <div className="proposal-category">{expandedProposal.category}</div>
              <div className="proposal-source">
                {expandedProposal.source === 'ai' ? 'AI Generated' : 'User Generated'}
              </div>
            </div>
            
            <h3 className="proposal-title">{expandedProposal.title}</h3>
            <div className="proposal-company">Target: {expandedProposal.company}</div>
            
            <p className="proposal-description">{expandedProposal.description}</p>
            
            <div className="proposal-preview">
              <div className="proposal-impact">
                <strong>Potential Impact:</strong>
                <ul>
                  {expandedProposal.impact.map((impact, index) => (
                    <li key={index}>{impact.metric}: {impact.value}</li>
                  ))}
                </ul>
              </div>
              
              <div className="proposal-footer">
                <div className="proposal-votes">
                  <button 
                    className={`vote-button ${votedProposals.includes(expandedProposal.id) ? 'voted' : ''}`}
                    onClick={() => handleVote(expandedProposal.id)}
                    disabled={votedProposals.includes(expandedProposal.id)}
                  >
                    {votedProposals.includes(expandedProposal.id) ? 'Voted' : 'Vote'} ({expandedProposal.votes})
                  </button>
                </div>
                <div className="proposal-tags">
                  {expandedProposal.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Collaboration Modal */}
      {expandedCollaboration && (
        <div className="modal-overlay" onClick={handleCloseCollaborationDetails}>
          <div className="expanded-proposal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseCollaborationDetails}>×</button>
            
            <div className="proposal-header">
              <div className="proposal-category">{expandedCollaboration.category}</div>
              <div className="proposal-source">
                {expandedCollaboration.source === 'ai' ? 'AI Generated' : 'Static'}
              </div>
            </div>
            
            <h3 className="proposal-title">{expandedCollaboration.title}</h3>
            <div className="proposal-company">Organizer: {expandedCollaboration.organization}</div>
            
            <p className="proposal-description">{expandedCollaboration.description}</p>
            
            <div className="proposal-preview">
              <div className="proposal-impact">
                <strong>Key Criteria:</strong>
                <ul>
                  {expandedCollaboration.criteria.map((criterion, index) => (
                    <li key={index}>{criterion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="proposal-details">
                <div className="incentive-funding">
                  <strong>Funding:</strong> {expandedCollaboration.fundingAvailable}
                </div>
                <div className="incentive-deadline">
                  <strong>Deadline:</strong> {expandedCollaboration.deadline}
                </div>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                <strong>Partners:</strong> {expandedCollaboration.companies.map(companyId => {
                  const company = COMPANY_DATA.find(c => c.id === companyId);
                  return company ? company.name : companyId;
                }).join(', ')}
              </div>
              
              <div className="proposal-footer">
                <button 
                  className="apply-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseCollaborationDetails();
                    setSelectedCollaboration(expandedCollaboration);
                  }}
                  style={styles.applyButton}
                >
                  Apply for Collaboration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Form Modal */}
      {selectedCollaboration && (
        <div className="modal-overlay" onClick={handleCloseCollaborationForm}>
          <div 
            className="collaboration-form-panel" 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              bottom: '0',
              left: '0',
              right: '0',
              background: 'white',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '30px',
              boxShadow: '0 -5px 25px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              maxHeight: '80vh',
              overflowY: 'auto',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <button 
              className="close-button" 
              onClick={handleCloseCollaborationForm}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            
            <div className="collaboration-form-content">
              <h2 style={{ color: '#006064', marginBottom: '20px' }}>Join this Collaboration</h2>
              
              <div className="collaboration-details" style={{ marginBottom: '20px' }}>
                <h3>{selectedCollaboration.title}</h3>
                <p style={{ color: '#555', marginBottom: '15px' }}>
                  {selectedCollaboration.companies.map(companyId => {
                    const company = COMPANY_DATA.find(c => c.id === companyId);
                    return company ? company.name : '';
                  }).filter(Boolean).join(' & ')}
                </p>
                
                <div className="collaboration-partners" style={{ marginBottom: '15px' }}>
                  <h4 style={{ marginBottom: '8px' }}>Current Partners:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedCollaboration.companies.map(companyId => {
                      const company = COMPANY_DATA.find(c => c.id === companyId);
                      return company ? (
                        <div 
                          key={companyId}
                          style={{
                            background: '#f5f5f5',
                            padding: '8px 12px',
                            borderRadius: '20px',
                            fontSize: '14px'
                          }}
                        >
                          {company.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div className="collaboration-contact" style={{ marginBottom: '15px' }}>
                  <h4 style={{ marginBottom: '8px' }}>Contact Information:</h4>
                  <p>
                    <strong>Primary Contact:</strong> {selectedCollaboration.organization} Sustainability Team<br />
                    <strong>Email:</strong> collaborate@{selectedCollaboration.organization.toLowerCase().replace(/\s+/g, '')}.org<br />
                    <strong>Deadline:</strong> {selectedCollaboration.deadline}
                  </p>
                </div>
              </div>
              
              <div className="collaboration-form">
                <h4 style={{ marginBottom: '15px' }}>How would you like to contribute?</h4>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Your Organization
                  </label>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="">Select your organization</option>
                    {COMPANY_DATA.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    How You Can Contribute
                  </label>
                  <textarea 
                    placeholder="Describe how your organization can contribute to this collaboration..."
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Resources You Can Provide
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {['Funding', 'Expertise', 'Technology', 'Network', 'Infrastructure'].map(resource => (
                      <label key={resource} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input type="checkbox" name="resources" value={resource} />
                        {resource}
                      </label>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="submit-collaboration-button"
                  style={{
                    background: '#006064',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px 24px',
                    width: '100%',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginTop: '10px',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => {
                    alert('Your collaboration request has been sent!');
                    handleCloseCollaborationForm();
                  }}
                >
                  Submit Collaboration Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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