import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../utils/projectData';
import { api } from '../utils/projectData';
import CreateProjectModal from './CreateProjectModal';
import EmployeePopup from './EmployeePopup';
import './TopBar.css';

interface TopBarProps {
  title?: string;
}

// Mock employee data
const employees = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sarah Johnson' },
  { id: 3, name: 'Michael Brown' },
  { id: 4, name: 'Emily Davis' },
  { id: 5, name: 'David Wilson' },
  { id: 6, name: 'Jessica Taylor' },
  { id: 7, name: 'James Anderson' },
  { id: 8, name: 'Amanda Martinez' },
];

const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEmployeePopup, setShowEmployeePopup] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleEmployeeClick = () => {
    setShowEmployeePopup(true);
    setShowProfileDropdown(false);
  };

  const handleEmployeeChat = (employeeId: number, name: string, company: string) => {
    // Create a URL-friendly version of the name and company
    const nameSlug = name.toLowerCase().replace(/\s+/g, '-');
    const companySlug = company.toLowerCase().replace(/\s+/g, '-');
    
    // Navigate to a more descriptive chat URL that includes the employee name and company
    navigate(`/chat/${employeeId}/${nameSlug}/${companySlug}`);
    setShowEmployeePopup(false);
  };

  const handleAccountClick = () => {
    navigate('/profile');
    setShowProfileDropdown(false);
  };

  const handleCollaborationsClick = () => {
    navigate('/collaborate');
  };

  const openProjectModal = () => {
    setShowProjectModal(true);
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              onClick={()=>navigate('/')}
            />
          </div>
          
          <div className="top-bar-nav">
            <div 
              className="nav-item" 
              onClick={handleCollaborationsClick}
            >
              Collaborations
            </div>
            <button className="add-project-btn" onClick={openProjectModal}>
              <img 
                src="/assets/plus.svg" 
                alt="Add" 
                className="plus-icon"
                style={{ filter: 'brightness(0) invert(1)' }}
              /> 
              Project
            </button>
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <div className="profile-icon-container" onClick={handleProfileClick}>
                <img 
                  src="/assets/user-circle.svg" 
                  alt="Profile" 
                  className="profile-icon"
                />
              </div>
              {showProfileDropdown && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-item" onClick={handleEmployeeClick}>
                    Employees
                  </div>
                  <div className="dropdown-item" onClick={handleAccountClick}>
                    Account
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateProjectModal 
        isOpen={showProjectModal}
        onClose={closeProjectModal}
        onSave={handleSaveProject}
      />

      <EmployeePopup
        isOpen={showEmployeePopup}
        onClose={() => setShowEmployeePopup(false)}
        onChatClick={handleEmployeeChat}
      />
    </>
  );
};

export default TopBar;