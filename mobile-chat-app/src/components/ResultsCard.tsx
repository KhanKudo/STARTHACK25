import React from 'react';
import { CardData } from './SwipeCard';
import './ResultsCard.css';

interface ResultsCardProps {
  project: CardData;
  rank: number;
  onChatClick?: (projectId: string) => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ project, rank, onChatClick }) => {
  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChatClick) {
      onChatClick(project.id);
    }
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
        <button className="chat-button" onClick={handleChatClick}>
          <svg className="chat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Chat
        </button>
      </div>
    </div>
  );
};

export default ResultsCard; 