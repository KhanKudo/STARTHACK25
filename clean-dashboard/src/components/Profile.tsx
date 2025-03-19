import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="top-bar-container">
        <TopBar title="Profile" />
      </div>
      <div className="profile-content">
        <button className="back-button" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
        
        <div className="profile-header">
          <div className="profile-avatar">
            <img src="/assets/profile.svg" alt="Profile" className="avatar-image" />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">John Doe</h1>
            <p className="profile-title">Project Manager</p>
            <p className="profile-company">Virgin Group</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="details-section">
            <h2 className="section-title">Contact Information</h2>
            <div className="details-item">
              <span className="item-label">Email:</span>
              <span className="item-value">john.doe@virgin.com</span>
            </div>
            <div className="details-item">
              <span className="item-label">Phone:</span>
              <span className="item-value">+44 1234 567890</span>
            </div>
            <div className="details-item">
              <span className="item-label">Location:</span>
              <span className="item-value">London, UK</span>
            </div>
          </div>
          
          <div className="details-section">
            <h2 className="section-title">Projects</h2>
            <div className="projects-summary">
              <div className="project-stat">
                <span className="stat-number">12</span>
                <span className="stat-label">Active Projects</span>
              </div>
              <div className="project-stat">
                <span className="stat-number">38</span>
                <span className="stat-label">Completed Projects</span>
              </div>
              <div className="project-stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Teams</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 