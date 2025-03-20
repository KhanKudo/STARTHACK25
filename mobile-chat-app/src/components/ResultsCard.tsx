import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardData } from './SwipeCard';
import './ResultsCard.css';

interface ResultsCardProps {
  project: CardData;
  rank: number;
  onChatClick?: (projectId: string) => void;
  matchedInterests?: string[];
  sustainabilityPoints?: number;
  index?: number; // Added index for navigation
}

interface PointsBreakdown {
  initialEngagement: number;
  taskCompletion: number;
  communityFeedback: number;
  educationalBonus: number;
  total: number;
  userContribution: number;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ 
  project, 
  rank, 
  onChatClick,
  matchedInterests = [],
  sustainabilityPoints = Math.floor(Math.random() * 50) + 25, // Default random points between 25-75
  index = 0 // Default index
}) => {
  const navigate = useNavigate();
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdown | null>(null);
  
  // Calculate points breakdown only once on mount
  useEffect(() => {
    // Calculate points breakdown with fixed values based on project id
    const initialEngagement = 25;
    // Use project id as seed for deterministic "random" values
    const seed = parseInt(project.id) || index;
    const taskCompletion = 10 + (seed % 30);
    const communityFeedback = (seed * 2) % 20;
    const educationalBonus = (seed * 3) % 10;
    const total = initialEngagement + taskCompletion + communityFeedback + educationalBonus;
    const userContribution = Math.floor(total * 0.6); // User has contributed about 60% of the potential

    setPointsBreakdown({
      initialEngagement,
      taskCompletion,
      communityFeedback,
      educationalBonus,
      total,
      userContribution
    });
  }, [project.id, index]);

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (onChatClick) {
      onChatClick(project.id);
    }
  };

  const togglePointsBreakdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    setShowPointsBreakdown(!showPointsBreakdown);
  };

  const handleCardClick = () => {
    // Navigate to project details page using the project name as identifier
    // Encode to make it URL-safe
    const projectName = encodeURIComponent(project.name);
    navigate(`/project/${projectName}`);
  };

  // Ensure we have the points breakdown before rendering
  if (!pointsBreakdown) {
    return <div className="results-card loading">Loading...</div>;
  }

  return (
    <div className="results-card" onClick={handleCardClick}>
      <div className="rank-badge">{rank}</div>
      <div 
        className="results-card-image" 
        style={{ backgroundImage: `url(${project.imageUrl})` }}
      />
      <div className="results-card-content">
        <h3 className="results-card-company">{project.details?.company}</h3>
        <h2 className="results-card-title">{project.name}</h2>
        <p className="results-card-description">
          {project.details?.description && project.details.description.length > 150
            ? project.details.description.substring(0, 150) + '...'
            : project.details?.description}
        </p>
        
        {matchedInterests.length > 0 && (
          <div className="matched-topics">
            <div className="interests-container">
              {matchedInterests.map((interest, index) => (
                <div key={index} className="interest-card">
                  {interest}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="sustainability-value" onClick={togglePointsBreakdown}>
          <span className="sustainability-value-icon">🌱</span>
          <span>Sustainability Value: {pointsBreakdown.total}pts</span>
        </div>
        
        <button className="chat-button" onClick={handleChatClick}>
          <svg className="chat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Chat
        </button>
      </div>
      
      {/* Points Breakdown Modal */}
      <div className={`overlay ${showPointsBreakdown ? 'visible' : ''}`} onClick={togglePointsBreakdown}></div>
      <div className={`points-breakdown ${showPointsBreakdown ? 'visible' : ''}`}>
        <div className="points-breakdown-header">
          Points Breakdown
        </div>
        <div className="points-breakdown-content">
          <div className="points-item">
            <div>Initial engagement:</div>
            <div>{pointsBreakdown.initialEngagement}</div>
          </div>
          <div className="points-item">
            <div>Task completion:</div>
            <div>{pointsBreakdown.taskCompletion}</div>
          </div>
          <div className="points-item">
            <div>Community feedback:</div>
            <div>{pointsBreakdown.communityFeedback}</div>
          </div>
          <div className="points-item">
            <div>Educational bonus:</div>
            <div>{pointsBreakdown.educationalBonus}</div>
          </div>
          <div className="points-divider"></div>
          <div className="points-total">
            <div>Total project value:</div>
            <div>{pointsBreakdown.total}</div>
          </div>
          <div className="points-contribution">
            <div>Your contribution:</div>
            <div>{pointsBreakdown.userContribution}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard; 