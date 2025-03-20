import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../utils/projectData';
import { api } from '../services/api';
import CreateProjectModal from './CreateProjectModal';
import './TopBar.css';

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const handleProfileClick = () => {
    navigate('/profile');
  };

  const openProjectModal = () => {
    setShowProjectModal(true);
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const newProject = await api.addProject(projectData);
      
      // Dispatch an event to notify that a project was added
      window.dispatchEvent(new CustomEvent('project-added', { detail: newProject }));
      
      // Optionally navigate to the new project
      // navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-title-container">
            <div className="top-bar-title">{title}</div>
          </div>
          
          <div className="logo-container">
            <img 
              src="/assets/Virgin_logo.svg" 
              alt="Virgin Logo" 
              className="virgin-logo"
            />
          </div>
          
          <div className="top-bar-nav">
            <div className="nav-item">Collaborations</div>
            <button className="add-project-btn" onClick={openProjectModal}>
              <img 
                src="/assets/plus.svg" 
                alt="Add" 
                className="plus-icon"
                style={{ filter: 'brightness(0) invert(1)' }}
              /> 
              Project
            </button>
            <div className="profile-icon-container" onClick={handleProfileClick}>
              <img 
                src="/assets/profile.svg" 
                alt="Profile" 
                className="profile-icon"
              />
            </div>
          </div>
        </div>
      </div>

      <CreateProjectModal 
        isOpen={showProjectModal}
        onClose={closeProjectModal}
        onSave={handleSaveProject}
      />
    </>
  );
};

export default TopBar;