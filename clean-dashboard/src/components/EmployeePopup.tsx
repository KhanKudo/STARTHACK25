import React, { useState, useEffect } from 'react';
import './EmployeePopup.css';
import { projectData } from '../utils/projectData';

interface Employee {
  id: number;
  name: string;
  company: string;
  projects: string[];
}

// Get all unique initiatives from project data
const getProjectInitiatives = (): string[] => {
  return projectData.map(project => project.initiative).sort();
};

// Mock employees data with company and real project initiatives
const mockEmployees: Employee[] = [
  { id: 1, name: 'John Smith', company: 'Virgin Atlantic', projects: ['Youngest, Cleanest Fleet in the Sky', 'Customer Experience'] },
  { id: 2, name: 'Sarah Johnson', company: 'Virgin Galactic', projects: ['Future of Space Tourism'] },
  { id: 3, name: 'Michael Brown', company: 'Virgin Media', projects: ['Network Infrastructure', 'Sustainable Digital Future'] },
  { id: 4, name: 'Emily Davis', company: 'Virgin Atlantic', projects: ['Youngest, Cleanest Fleet in the Sky', 'In-flight Entertainment'] },
  { id: 5, name: 'David Wilson', company: 'Virgin Hotels', projects: ['Guest Experience', 'Property Development'] },
  { id: 6, name: 'Jessica Taylor', company: 'Virgin Galactic', projects: ['Future of Space Tourism', 'Space Tourism'] },
  { id: 7, name: 'James Anderson', company: 'Virgin Media', projects: ['Broadband Services', 'Sustainable Digital Future'] },
  { id: 8, name: 'Amanda Martinez', company: 'Virgin Orbit', projects: ['Satellite Launch', 'Aerospace Engineering'] },
  { id: 9, name: 'Robert Johnson', company: 'Virgin Voyages', projects: ['Scarlet Lady', 'Entertainment Programming'] },
  { id: 10, name: 'Elizabeth Wilson', company: 'Virgin Atlantic', projects: ['Sustainability', 'Youngest, Cleanest Fleet in the Sky'] },
  { id: 11, name: 'Thomas Clark', company: 'Virgin Hotels', projects: ['Restaurant Concepts', 'Booking Platform'] },
  { id: 12, name: 'Patricia Lewis', company: 'Virgin Orbit', projects: ['Ground Operations', 'Mission Control'] },
];

// Get unique companies for filter
const getUniqueCompanies = (): string[] => {
  const uniqueCompanies: string[] = [];
  mockEmployees.forEach(emp => {
    if (!uniqueCompanies.includes(emp.company)) {
      uniqueCompanies.push(emp.company);
    }
  });
  return uniqueCompanies.sort();
};

// Get unique projects for filter - use real project initiatives
const getUniqueProjects = (): string[] => {
  const uniqueProjects: string[] = [];
  mockEmployees.forEach(emp => {
    emp.projects.forEach(project => {
      if (!uniqueProjects.includes(project)) {
        uniqueProjects.push(project);
      }
    });
  });
  return uniqueProjects.sort();
};

// Get projects for a specific company
const getProjectsByCompany = (company: string): string[] => {
  const companyProjects: string[] = [];
  
  mockEmployees
    .filter(emp => company === '' || emp.company === company)
    .forEach(emp => {
      emp.projects.forEach(project => {
        if (!companyProjects.includes(project)) {
          companyProjects.push(project);
        }
      });
    });
  
  return companyProjects.sort();
};

const companies = getUniqueCompanies();
const allProjects = getUniqueProjects();

interface EmployeePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onChatClick: (employeeId: number, name: string, company: string) => void;
}

const EmployeePopup: React.FC<EmployeePopupProps> = ({ isOpen, onClose, onChatClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees);
  const [availableProjects, setAvailableProjects] = useState<string[]>(allProjects);

  // Update available projects when company selection changes
  useEffect(() => {
    if (selectedCompany) {
      setAvailableProjects(getProjectsByCompany(selectedCompany));
      
      // Clear project selection if the selected project is not in the new company's projects
      const companyProjects = getProjectsByCompany(selectedCompany);
      if (selectedProject && !companyProjects.includes(selectedProject)) {
        setSelectedProject('');
      }
    } else {
      setAvailableProjects(allProjects);
    }
  }, [selectedCompany]);

  // Apply filters when search term or filters change
  useEffect(() => {
    let results = mockEmployees;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(employee => 
        employee.name.toLowerCase().includes(term)
      );
    }

    // Filter by company
    if (selectedCompany) {
      results = results.filter(employee => 
        employee.company === selectedCompany
      );
    }

    // Filter by project
    if (selectedProject) {
      results = results.filter(employee => 
        employee.projects.includes(selectedProject)
      );
    }

    setFilteredEmployees(results);
  }, [searchTerm, selectedCompany, selectedProject]);

  // Close popup if clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCompany('');
    setSelectedProject('');
  };

  if (!isOpen) return null;

  return (
    <div className="employee-popup-backdrop" onClick={handleBackdropClick}>
      <div className="employee-popup-container">
        <div className="employee-popup-header">
          <h2>Virgin Group Employees</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="employee-popup-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label>Company:</label>
              <select 
                value={selectedCompany} 
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="filter-select"
              >
                <option value="">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Project:</label>
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
                className="filter-select"
              >
                <option value="">All Projects</option>
                {availableProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            
            {(searchTerm || selectedCompany || selectedProject) && (
              <button 
                className="reset-filters-button" 
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
        
        <div className="employee-list-content">
          {filteredEmployees.length === 0 ? (
            <div className="no-results">No employees match your filters</div>
          ) : (
            filteredEmployees.map(employee => (
              <div key={employee.id} className="employee-card">
                <div className="employee-info">
                  <div className="employee-name">{employee.name}</div>
                  <div className="employee-company">{employee.company}</div>
                  <div className="employee-projects">
                    {employee.projects.join(', ')}
                  </div>
                </div>
                <button 
                  className="chat-button"
                  onClick={() => onChatClick(employee.id, employee.name, employee.company)}
                >
                  <img 
                    src="/assets/chat.svg" 
                    alt="Chat" 
                    className="chat-icon"
                  />
                  Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePopup; 