import React, { useState } from 'react';
import { CardData } from './SwipeCard';
import './ResultsCard.css';

interface ResultsCardProps {
  project: CardData;
  rank: number;
  onChatClick?: (projectId: string) => void;
  matchedInterests?: string[];
  sustainabilityPoints?: number;
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
  sustainabilityPoints = Math.floor(Math.random() * 50) + 25 // Default random points between 25-75
}) => {
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  
  // Calculate random points breakdown
  const getPointsBreakdown = (): PointsBreakdown => {
    const initialEngagement = 25;
    const taskCompletion = Math.floor(Math.random() * 30) + 10;
    const communityFeedback = Math.floor(Math.random() * 20);
    const educationalBonus = Math.floor(Math.random() * 10);
    const total = initialEngagement + taskCompletion + communityFeedback + educationalBonus;
    const userContribution = Math.floor(total * 0.6); // User has contributed about 60% of the potential

    return {
      initialEngagement,
      taskCompletion,
      communityFeedback,
      educationalBonus,
      total,
      userContribution
    };
  };

  const pointsBreakdown = getPointsBreakdown();

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChatClick) {
      onChatClick(project.id);
    }
  };

  const togglePointsBreakdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPointsBreakdown(!showPointsBreakdown);
  };

  return (
    <div className="results-card">
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