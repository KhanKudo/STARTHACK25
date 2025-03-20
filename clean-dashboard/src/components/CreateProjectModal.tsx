import React, { useState, useEffect } from 'react';
import { Project } from '../utils/projectData';
import Loader from './Loader';
import './CreateProjectModal.css';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    company: '',
    initiative: '',
    challenge: '',
    description: '',
    callToAction: '',
    links: [''],
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  });

  const [linksInput, setLinksInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLinksInput(e.target.value);
    // Convert each line to a separate link
    const linksArray = e.target.value.split('\n').filter(link => link.trim() !== '');
    setFormData({
      ...formData,
      links: linksArray,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Generate sample projects by picking from these options
  const generateSampleProject = () => {
    const companies = ['Virgin Atlantic', 'Virgin Media', 'Virgin Galactic', 'Virgin Voyages'];
    const initiatives = ['Carbon Reduction', 'Renewable Energy', 'Ocean Cleanup', 'Sustainable Tech'];
    const challenges = [
      'Reducing carbon emissions in the travel industry requires innovative solutions.',
      'Finding sustainable alternatives to traditional fuels is a pressing challenge.',
      'Ocean pollution threatens marine ecosystems and requires immediate action.',
      'Developing technology that minimizes environmental impact while maximizing efficiency.'
    ];
    
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomInitiative = initiatives[Math.floor(Math.random() * initiatives.length)];
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    const newFormData = {
      ...formData,
      company: randomCompany,
      initiative: randomInitiative,
      challenge: randomChallenge,
      description: `This is a sample project by ${randomCompany} focused on ${randomInitiative.toLowerCase()}.`,
      callToAction: 'Join us in making a difference!',
      links: ['https://virgin.com/sustainability']
    };
    
    setFormData(newFormData);
    setLinksInput('https://virgin.com/sustainability');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <div className="modal-header">
          <h2>Create New Project</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="company" className="required-field">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="initiative" className="required-field">Initiative</label>
            <input
              type="text"
              id="initiative"
              name="initiative"
              value={formData.initiative}
              onChange={handleChange}
              required
              placeholder="Enter initiative title"
            />
            <div className="field-hint">A short, catchy title for your sustainability initiative</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="challenge" className="required-field">Challenge</label>
            <textarea
              id="challenge"
              name="challenge"
              value={formData.challenge}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Describe the environmental challenge"
            />
            <div className="field-hint">A brief description of the environmental challenge being addressed</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide a detailed description of the project"
            />
            <div className="field-hint">More detailed information about how your project addresses the challenge</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="callToAction">Call to Action</label>
            <textarea
              id="callToAction"
              name="callToAction"
              value={formData.callToAction}
              onChange={handleChange}
              rows={2}
              placeholder="How can others get involved?"
            />
            <div className="field-hint">Specific ways others can participate or support the initiative</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="links">Links (one per line)</label>
            <textarea
              id="links"
              name="links"
              value={linksInput}
              onChange={handleLinksChange}
              rows={3}
              placeholder="https://example.com"
            />
            <div className="field-hint">Resource links where people can learn more or take action</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <div className="field-hint">A URL for an image that represents your project</div>
            {formData.imageUrl && (
              <div 
                className="image-preview" 
                style={{ backgroundImage: `url(${formData.imageUrl})` }}
              />
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="sample-button" 
              onClick={generateSampleProject}
              disabled={isSubmitting}
            >
              Generate Sample
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading-button-text">
                  <Loader size="small" inline />
                  Saving...
                </span>
              ) : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
      {isSubmitting && <Loader fullScreen />}
    </div>
  );
};

export default CreateProjectModal; 