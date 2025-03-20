import React from 'react';
import { ProjectData } from '../types/projectTypes';
import MatchedProjectCard from './MatchedProjectCard';
import './MatchedProjectsGrid.css';

interface MatchedProjectsGridProps {
  projects: ProjectData[];
}

const MatchedProjectsGrid: React.FC<MatchedProjectsGridProps> = ({ projects }) => {
  return (
    <div className="matched-projects-section">
      <h2 className="section-title">Your Matched Projects</h2>
      <div className="matched-projects-grid">
        {projects.map((project) => (
          <MatchedProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchedProjectsGrid; 