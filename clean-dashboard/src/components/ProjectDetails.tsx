import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import { getProjectById, Project } from '../utils/projectData';
import './ProjectDetails.css';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | undefined>(undefined);

  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(projectId);
      setProject(projectData);
      
      if (!projectData) {
        // If project not found, redirect to dashboard
        navigate('/');
      }
    }
  }, [projectId, navigate]);

  const handleBackClick = () => {
    navigate('/');
  };

  if (!project) {
    return (
      <div className="project-details-page">
        <div className="top-bar-container">
          <TopBar title="Project Not Found" />
        </div>
        <div className="project-content">
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Dashboard
          </button>
          <div className="error-message">
            Project not found. Please return to the dashboard.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      <div className="top-bar-container">
        <TopBar title={project.initiative} />
      </div>
      <div className="project-content">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Dashboard
        </button>
        
        <div className="project-header" style={{ backgroundImage: `url(${project.imageUrl})` }}>
          <div className="project-header-overlay">
            <div className="project-header-content">
              <h1 className="project-title">{project.initiative}</h1>
              <h2 className="project-company">{project.company}</h2>
            </div>
          </div>
        </div>
        
        <div className="project-details-content">
          <div className="project-section">
            <h3 className="section-title">The Challenge</h3>
            <p className="section-text">{project.challenge}</p>
          </div>
          
          {project.description && (
            <div className="project-section">
              <h3 className="section-title">What Virgin is doing</h3>
              <p className="section-text">{project.description}</p>
            </div>
          )}
          
          {project.callToAction && (
            <div className="project-section">
              <h3 className="section-title">Call to Action</h3>
              <p className="section-text">{project.callToAction}</p>
            </div>
          )}
          
          {project.links && project.links.length > 0 && (
            <div className="project-section">
              <h3 className="section-title">Relevant Links</h3>
              <ul className="links-list">
                {project.links.map((link, index) => (
                  <li key={index} className="link-item">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 