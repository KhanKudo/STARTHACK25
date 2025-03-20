import React, { useState } from 'react';
import { ProjectData } from '../types/projectTypes';
import './MatchedProjectCard.css';

interface MatchedProjectCardProps {
  project: ProjectData;
}

const MatchedProjectCard: React.FC<MatchedProjectCardProps> = ({ project }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    // In a real app, you would navigate to a chat, but for this demo we'll just log
    console.log(`Chat with ${project.company} about ${project.initiative}`);
    alert(`Starting chat with ${project.company} about ${project.initiative}`);
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const getCardBackground = () => {
    if (imageError) {
      // Use a colored background with text as fallback
      const colorMap: Record<string, string> = {
        'Virgin Atlantic': '#e3173e',
        'Virgin Voyages': '#881f5a',
        'Virgin Media 02': '#ed1c24',
        'Virgin Unite': '#cf0072',
        'Virgin Limited Edition': '#000000',
        'default': '#cc0033'
      };
      
      // Try to match company or use default color
      let bgColor = colorMap['default'];
      
      for (const [key, value] of Object.entries(colorMap)) {
        if (project.company.includes(key)) {
          bgColor = value;
          break;
        }
      }
      
      return { 
        backgroundColor: bgColor,
        backgroundImage: 'none' 
      };
    }
    
    return { backgroundImage: `url(${project.imageUrl})` };
  };
  
  return (
    <div className="matched-project-card">
      <div 
        className="matched-project-card-image" 
        style={getCardBackground()}
      >
        {imageError && (
          <div className="fallback-image-text">{project.company}</div>
        )}
        {!imageError && (
          <img 
            src={project.imageUrl} 
            alt="" 
            style={{ display: 'none' }} 
            onError={handleImageError} 
          />
        )}
      </div>
      <div className="matched-project-card-content">
        <h3 className="matched-project-card-company">{project.company}</h3>
        <h4 className="matched-project-card-initiative">{project.initiative}</h4>
        <p className="matched-project-card-challenge">
          {project.challenge.length > 120 ? `${project.challenge.substring(0, 120)}...` : project.challenge}
        </p>
        <button className="chat-button" onClick={handleChatClick}>
          <svg className="chat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Chat with {project.company}
        </button>
      </div>
    </div>
  );
};

export default MatchedProjectCard; 