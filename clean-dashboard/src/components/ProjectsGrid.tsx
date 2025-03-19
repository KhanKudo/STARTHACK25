import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { projectData } from '../utils/projectData';
import './ProjectsGrid.css';

const ProjectsGrid: React.FC = () => {
  const [visibleProjects, setVisibleProjects] = useState(6);
  
  const handleLoadMore = () => {
    setVisibleProjects(prev => Math.min(prev + 6, projectData.length));
  };

  return (
    <div className="projects-section">
      <h2 className="section-title">Company Projects</h2>
      <div className="projects-grid">
        {projectData.slice(0, visibleProjects).map((project, index) => (
          <div className="project-card-container" key={project.id}>
            <ProjectCard
              id={project.id}
              company={project.company}
              initiative={project.initiative}
              challenge={project.challenge}
              imageUrl={project.imageUrl}
            />
          </div>
        ))}
      </div>
      
      {visibleProjects < projectData.length && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={handleLoadMore}>
            Load more projects
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsGrid; 