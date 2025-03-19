import React from 'react';
import { CardData } from './SwipeCard';
import './ResultsCard.css';

interface ResultsCardProps {
  project: CardData;
  rank: number;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ project, rank }) => {
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
      </div>
    </div>
  );
};

export default ResultsCard; 