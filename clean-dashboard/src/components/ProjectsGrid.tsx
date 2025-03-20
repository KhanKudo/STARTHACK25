import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../models/project';
import ProjectCard from './ProjectCard';
import './ProjectsGrid.css';

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  return (
    <div className="projects-section">
      <h2 className="section-title">Company Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
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
    </div>
  );
};

export default ProjectsGrid; 