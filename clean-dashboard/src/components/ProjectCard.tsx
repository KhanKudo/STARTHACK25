import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

interface ProjectCardProps {
  id: string;
  company: string;
  initiative: string;
  challenge: string;
  imageUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  id,
  company, 
  initiative, 
  challenge,
  imageUrl 
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/project/${id}`);
  };
  
  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    navigate(`/chat/${id}`);
  };
  
  return (
    <div className="project-card" onClick={handleCardClick}>
      <div 
        className="project-card-image" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="project-card-content">
        <h3 className="project-card-company">{company}</h3>
        <h4 className="project-card-initiative">{initiative}</h4>
        <p className="project-card-challenge">{challenge.length > 120 ? `${challenge.substring(0, 120)}...` : challenge}</p>
        <button className="chat-button" onClick={handleChatClick}>
          <svg className="chat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Chat with {company}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard; 