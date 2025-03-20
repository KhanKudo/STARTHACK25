import React, { useState } from 'react';
import { Project } from '../utils/projectData';
import ProjectCard from './ProjectCard';
import './ProjectsGrid.css';

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const [visibleProjects, setVisibleProjects] = useState(6);
  
  const handleLoadMore = () => {
    setVisibleProjects(prev => Math.min(prev + 6, projects.length));
  };

  return (
    <div className="projects-section">
      <h2 className="section-title">Company Projects</h2>
      <div className="projects-grid">
        {projects.slice(0, visibleProjects).map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => {
              // Handle project click
              console.log('Project clicked:', project.id);
            }}
          />
        ))}
      </div>
      
      {visibleProjects < projects.length && (
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