import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';
import { Project } from '../../../models/project';

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
  
  // Status label map for human-readable labels
  const statusLabels: Record<string, string> = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'on-hold': 'On Hold'
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
        <div className="project-header">
          <h3 className="project-card-title">{project.initiative}</h3>
          
          {project.status && (
            <div className={`project-status ${project.status}`}>
              {statusLabels[project.status]}
            </div>
          )}
        </div>
        
        <p className="project-card-company">{project.company}</p>
        <p className="project-card-challenge">{project.challenge}</p>
        
        {project.completionPercentage !== undefined && (
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{width: `${project.completionPercentage}%`}}
            ></div>
            <span className="progress-text">{project.completionPercentage}% complete</span>
          </div>
        )}

        {project.impactAreas && project.impactAreas.length > 0 && (
          <div className="impact-metrics">
            {project.estimatedReduction && (
              <span className="metric-value">
                {project.estimatedReduction}% reduction
              </span>
            )}
            {project.impactAreas.map((area: string) => (
              <span key={area} className={`impact-badge ${area}`}>{area}</span>
            ))}
          </div>
        )}
        
        {project.tags && project.tags.length > 0 && (
          <div className="project-tags">
            {project.tags.map((tag: string) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        {project.timeline && (
          <div className="timeline-indicator">
            <span className={`timeline-dot ${project.timeline}`}></span>
            {project.timeline === 'short-term' ? 'Short-term' : 
             project.timeline === 'medium-term' ? 'Medium-term' : 'Long-term'}
          </div>
        )}

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