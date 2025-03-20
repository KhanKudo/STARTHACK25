import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';
import { Project } from '../utils/projectData';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.src = project.imageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  }, [project.imageUrl]);

  const handleCardClick = () => {
    navigate(`/project/${project.id}`);
  };
  
  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    navigate(`/chat/${project.id}`);
  };
  
  return (
    <div className="project-card" onClick={handleCardClick}>
      <div 
        className="project-card-image"
        style={{
          backgroundImage: imageError 
            ? 'url(/assets/fallback-image.jpg)' 
            : `url(${project.imageUrl})`,
          opacity: imageLoaded ? 1 : 0.7,
        }}
      />
      <div className="project-card-content">
        <h3 className="project-card-title">{project.initiative}</h3>
        <p className="project-card-company">{project.company}</p>
        <p className="project-card-challenge">{project.challenge}</p>
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

export default ProjectCard; 