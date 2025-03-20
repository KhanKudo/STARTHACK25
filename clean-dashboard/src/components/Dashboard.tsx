import React, { useState, useEffect, useRef } from 'react';
import TopBar from './TopBar';
import ProjectsGrid from './ProjectsGrid';
import GlobeContainer from './GlobeContainer';
import Loader from './Loader';
import { api } from '../utils/projectData';
import { Project } from '../utils/projectData';
import { searchProjects, SearchResult } from '../services/deepseekService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchExplanation, setSearchExplanation] = useState<string | null>(null);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProjects();
      setProjects(data);
      setFilteredProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredProjects(projects);
      setSearchExplanation(null);
      setError(null);
      return;
    }

    setSearching(true);
    setError(null);
    setSearchExplanation(null);

    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const result = await searchProjects(
        query,
        projects,
        abortControllerRef.current.signal
      );

      setFilteredProjects(result.projects);
      setSearchExplanation(result.explanation);
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        // Silently handle cancelled searches
        return;
      }
      // For other errors, just reset to show all projects without error message
      setFilteredProjects(projects);
      setSearchExplanation(null);
    } finally {
      setSearching(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!searching) {
        // Only trigger search if not already searching
        handleSearch(searchQuery);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchQuery('');
      setFilteredProjects(projects);
      setSearchExplanation(null);
      setError(null);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500);
    } else {
      setFilteredProjects(projects);
      setSearchExplanation(null);
      setError(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, projects]);

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, []);

  // Listen for changes in projectData
  useEffect(() => {
    const handleProjectAdded = (event: CustomEvent<Project>) => {
      setProjects(prevProjects => [event.detail, ...prevProjects]);
      setFilteredProjects(prevProjects => [event.detail, ...prevProjects]);
    };
    
    window.addEventListener('project-added', handleProjectAdded as EventListener);
    
    return () => {
      window.removeEventListener('project-added', handleProjectAdded as EventListener);
    };
  }, []);

  const getExplanationSummary = (explanation: string) => {
    // Get the first sentence or first 100 characters
    const firstSentence = explanation.match(/^[^.!?]+[.!?]/);
    if (firstSentence) {
      return firstSentence[0];
    }
    return explanation.slice(0, 100) + '...';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="top-bar-container">
          <TopBar title="Dashboard" />
        </div>
        <Loader fullScreen message="Loading projects..." />
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
            <img 
              src="/assets/ai.svg" 
              alt="AI" 
              className="ai-icon"
              style={{ 
                opacity: searchFocused ? 1 : 0.7,
                color: searchFocused ? 'var(--primary-red)' : '#888',
              }}
            />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search Projects (e.g., 'Show me water-related projects')" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onKeyDown={handleKeyPress}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              disabled={searching}
            />
            {searching && (
              <div className="search-status">
                <Loader message="Searching..." />
                <button 
                  className="cancel-search"
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredProjects(projects);
                    setSearchExplanation(null);
                    if (abortControllerRef.current) {
                      abortControllerRef.current.abort();
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {searchExplanation && (
            <div 
              className={`search-explanation ${isExplanationExpanded ? 'expanded' : 'collapsed'}`}
              onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
            >
              {isExplanationExpanded ? searchExplanation : getExplanationSummary(searchExplanation)}
              <svg 
                className="expand-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M7 10l5 5 5-5" />
              </svg>
            </div>
          )}
        </div>
        
        <ProjectsGrid projects={filteredProjects} />
      </div>
    </div>
  );
};

export default Dashboard; 