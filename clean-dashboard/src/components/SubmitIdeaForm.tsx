import React, { useState } from 'react';
import { Proposal } from '../utils/proposalData';
import './SubmitIdeaForm.css';

interface SubmitIdeaFormProps {
  isOpen: boolean;
  onSubmit: (proposal: Omit<Proposal, 'id' | 'votes' | 'status' | 'createdAt' | 'source'>) => void;
  onClose: () => void;
}

const SubmitIdeaForm: React.FC<SubmitIdeaFormProps> = ({ isOpen, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'carbon' as const,
    description: '',
    impact: [{ metric: '', value: '' }],
    tags: [''],
    isRecommended: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addImpactMetric = () => {
    setFormData(prev => ({
      ...prev,
      impact: [...prev.impact, { metric: '', value: '' }]
    }));
  };

  const updateImpactMetric = (index: number, field: 'metric' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      impact: prev.impact.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="submit-idea-form-overlay">
      <div className="submit-idea-form-container">
        <div className="submit-idea-form-header">
          <h2>Submit Your Idea</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="submit-idea-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              required
            >
              <option value="carbon">Carbon</option>
              <option value="water">Water</option>
              <option value="biodiversity">Biodiversity</option>
              <option value="social">Social</option>
              <option value="circular">Circular</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Impact Metrics</label>
            {formData.impact.map((impact, index) => (
              <div key={index} className="impact-metric-group">
                <input
                  type="text"
                  placeholder="Metric"
                  value={impact.metric}
                  onChange={(e) => updateImpactMetric(index, 'metric', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={impact.value}
                  onChange={(e) => updateImpactMetric(index, 'value', e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addImpactMetric} className="add-button">
              Add Impact Metric
            </button>
          </div>

          <div className="form-group">
            <label>Tags</label>
            {formData.tags.map((tag, index) => (
              <input
                key={index}
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                required
              />
            ))}
            <button type="button" onClick={addTag} className="add-button">
              Add Tag
            </button>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitIdeaForm; 