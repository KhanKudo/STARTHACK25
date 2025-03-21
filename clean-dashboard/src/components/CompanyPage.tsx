import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import { COMPANY_DATA, Company } from '../utils/companyData';
import { projectData, Project } from '../utils/projectData';
import './CompanyPage.css';

// Extend the existing Project interface
interface CompanyProject extends Project {
  sector?: string;
}

const CompanyPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyProjects, setCompanyProjects] = useState<CompanyProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanyData = () => {
      setLoading(true);
      
      // Find company by ID
      const foundCompany = COMPANY_DATA.find(c => c.id === companyId);
      
      if (foundCompany) {
        setCompany(foundCompany);
        
        // Find related projects
        const relatedProjects = projectData.filter(project => 
          project.company === foundCompany.name
        );
        
        // Map projects to CompanyProject interface
        const formattedProjects: CompanyProject[] = relatedProjects.map(project => ({
          ...project,
          sector: foundCompany.sector
        }));
        
        setCompanyProjects(formattedProjects);
      }
      
      setLoading(false);
    };
    
    fetchCompanyData();
  }, [companyId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  if (loading) {
    return (
      <div className="company-page">
        <TopBar />
        <div className="company-content">
          <p>Loading company information...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-page">
        <TopBar />
        <div className="company-content">
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
          <p>Company not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-page">
      <TopBar />
      <div className="company-content">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        
        <div className="company-header">
          <div className="company-logo-container">
            {company.images.logo ? (
              <img src={company.images.logo} alt={`${company.name} logo`} className="company-logo" />
            ) : (
              <div className="company-logo-placeholder">{company.name.charAt(0)}</div>
            )}
          </div>
          
          <div className="company-title">
            <h1>{company.name}</h1>
            <p className="company-sector">{company.sector}</p>
          </div>
        </div>
        
        <div className="company-description">
          <h2>About {company.name}</h2>
          <p>{company.description}</p>
        </div>
        
        <div className="company-projects">
          <h2>Projects</h2>
          {companyProjects.length > 0 ? (
            <div className="projects-grid">
              {companyProjects.map(project => (
                <div 
                  key={project.id} 
                  className="project-card"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div 
                    className="project-image" 
                    style={{ backgroundImage: `url(${project.imageUrl})` }}
                  />
                  <div className="project-info">
                    <h3>{project.initiative}</h3>
                    <p>{project.description?.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No projects found for this company.</p>
          )}
        </div>
        
        {company.images.gallery && company.images.gallery.length > 0 && (
          <div className="company-gallery">
            <h2>Gallery</h2>
            <div className="gallery-grid">
              {company.images.gallery.map((image, index) => (
                <div 
                  key={index} 
                  className="gallery-image"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="view-in-knowledge">
          <button 
            className="knowledge-button"
            onClick={() => navigate('/knowledge')}
          >
            View in Knowledge Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage; 