import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import ProjectsGrid from './ProjectsGrid';
import GlobeContainer from './GlobeContainer';
import { projectData } from '../utils/projectData';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [projectsVersion, setProjectsVersion] = useState(0);
  
  // Force a refresh when projects change
  const refreshProjects = () => {
    setProjectsVersion(v => v + 1);
  };

  // Listen for changes in projectData
  useEffect(() => {
    // Set up event listener for project updates
    window.addEventListener('project-added', refreshProjects);
    
    return () => {
      window.removeEventListener('project-added', refreshProjects);
    };
  }, []);

  return (
    <div className="dashboard">
      <div className="top-bar-container">
        <TopBar title="Dashboard" />
      </div>
      
      <GlobeContainer />
      
      <div className="dashboard-content">
        <div className="hero-section">
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search Projects" 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <img 
              src="/assets/ai.svg" 
              alt="AI" 
              className="ai-icon"
              style={{ 
                opacity: searchFocused ? 1 : 0.7,
                stroke: searchFocused ? 'var(--primary-red)' : '#3C3C3C',
              }}
            />
          </div>
        </div>
        
        <ProjectsGrid key={projectsVersion} />
      </div>
    </div>
  );
};

export default Dashboard; 