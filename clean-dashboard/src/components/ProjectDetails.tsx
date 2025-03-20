import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import { Project } from '../../../models/project';
import { api } from '../utils/projectData';
import './ProjectDetails.css';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const data = await api.getProjectById(projectId);
        setProject(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch project details');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleChatClick = () => {
    navigate(`/chat/${projectId}`);
  };

  const handleShareClick = () => {
    // In a real app, this would open a share dialog
    alert('Share functionality would be implemented here');
  };

  const handleDonateClick = () => {
    // In a real app, this would navigate to a donation page
    alert('Donation functionality would be implemented here');
  };

  const handleVolunteerClick = () => {
    // In a real app, this would navigate to a volunteer signup page
    alert('Volunteer signup would be implemented here');
  };

  if (loading) {
    return (
      <div className="project-details-page">
        <div className="top-bar-container">
          <TopBar title="Loading..." />
        </div>
        <div className="project-content">
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Dashboard
          </button>
          <div className="loading">Loading project details...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
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
            {error || 'Project not found. Please return to the dashboard.'}
          </div>
        </div>
      </div>
    );
  }

  // Sample links if not provided in the project data
  const defaultLinks = [
    'https://www.virgin.com/virgin-companies/virgin-atlantic',
    'https://flywith.virginatlantic.com/sustainability',
    'https://www.virginatlantic.com/sustainability'
  ];

  // Ensure we have links to display
  const links = project.links && project.links.length > 0 
    ? project.links 
    : defaultLinks;

  // Sample key metrics if not provided in the project data
  const keyMetrics = [
    {
      value: project.estimatedReduction || 27,
      unit: '%',
      label: 'Carbon Reduction',
      description: 'Estimated carbon footprint reduction'
    },
    {
      value: project.completionPercentage || 65,
      unit: '%',
      label: 'Progress',
      description: 'Project completion percentage'
    },
    {
      value: 342,
      unit: 'tons',
      label: 'CO₂ Saved',
      description: 'Annual carbon dioxide savings'
    },
    {
      value: 15000,
      unit: '+',
      label: 'Participants',
      description: 'People involved in this initiative'
    }
  ];

  // Sample suggested actions
  const suggestedActions = [
    {
      title: 'Share Your Knowledge',
      description: 'Contribute to our environmental research by sharing your observations and data',
      icon: 'research',
      action: handleShareClick
    },
    {
      title: 'Make a Donation',
      description: 'Support this initiative with a financial contribution to accelerate our progress',
      icon: 'donate',
      action: handleDonateClick
    },
    {
      title: 'Volunteer Your Time',
      description: 'Join our team of volunteers working on implementing sustainable solutions',
      icon: 'volunteer',
      action: handleVolunteerClick
    }
  ];

  return (
    <div className="project-details-page">
      <div className="top-bar-container">
        <TopBar title={project.initiative} />
      </div>
      
      <div className="project-banner" style={{ backgroundImage: `url(${project.imageUrl})` }}>
        <div className="banner-overlay">
          <div className="banner-content">
            <h1 className="project-title">{project.initiative}</h1>
            <h2 className="project-company">{project.company}</h2>
          </div>
        </div>
      </div>
      
      <div className="project-content">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Dashboard
        </button>
        
        <div className="project-details-content">
          <div className="project-section">
            <h3 className="section-title">The Challenge</h3>
            <p className="section-text">{project.challenge}</p>
          </div>
          
          {/* Key Metrics Section */}
          <div className="project-section">
            <h3 className="section-title">Key Metrics</h3>
            <div className="metrics-grid">
              {keyMetrics.map((metric, index) => (
                <div key={index} className="metric-card">
                  <div className="metric-value-container">
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-unit">{metric.unit}</span>
                  </div>
                  <h4 className="metric-label">{metric.label}</h4>
                  <p className="metric-description">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {project.description && (
            <div className="project-section">
              <h3 className="section-title">What Virgin is doing</h3>
              <p className="section-text">{project.description}</p>
            </div>
          )}
          
          {/* Suggested Actions Section */}
          <div className="project-section">
            <h3 className="section-title">How You Can Help</h3>
            <div className="actions-container">
              {suggestedActions.map((action, index) => (
                <div key={index} className="action-card">
                  <div className={`action-icon ${action.icon}`}>
                    {action.icon === 'research' && (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5c-.5-4.5-4-8-8.5-8.5-4 0-7.5 3.5-8.5 8.5-.5 4 3 7.5 7 8.5 4.5.5 8-3 9-7 .5-1 .5-1 1-1.5" />
                        <path d="M12 6L12 12 17 12" />
                      </svg>
                    )}
                    {action.icon === 'donate' && (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 10V8c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2v2H7z" />
                        <path d="M5 18a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5z" />
                        <path d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                      </svg>
                    )}
                    {action.icon === 'volunteer' && (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    )}
                  </div>
                  <div className="action-content">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-description">{action.description}</p>
                    <button className="action-button" onClick={action.action}>
                      Get Involved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {project.callToAction && (
            <div className="project-section">
              <h3 className="section-title">Call to Action</h3>
              <p className="section-text">{project.callToAction}</p>
            </div>
          )}
          
          {/* Always display links section with default links if needed */}
          <div className="project-section">
            <h3 className="section-title">Links</h3>
            <ul className="links-list">
              {links.map((link, index) => (
                <li key={index} className="link-item">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="chat-button-container">
            <button className="chat-with-company" onClick={handleChatClick}>
              <svg className="chat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Chat with {project.company}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 