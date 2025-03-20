import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import ProjectsGrid from './ProjectsGrid';
import GlobeContainer from './GlobeContainer';
import { api } from '../services/api';
import { Project } from '../utils/projectData';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, []);

  // Listen for changes in projectData
  useEffect(() => {
    const handleProjectAdded = (event: CustomEvent<Project>) => {
      setProjects(prevProjects => [event.detail, ...prevProjects]);
    };
    
    window.addEventListener('project-added', handleProjectAdded as EventListener);
    
    return () => {
      window.removeEventListener('project-added', handleProjectAdded as EventListener);
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="top-bar-container">
          <TopBar title="Dashboard" />
        </div>
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="top-bar-container">
          <TopBar title="Dashboard" />
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

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
              placeholder="Search projects..." 
            />
          </div>
        </div>
        
        <ProjectsGrid projects={projects} />
      </div>
    </div>
  );
};

export default Dashboard; 