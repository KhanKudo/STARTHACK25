import React, { useState } from 'react';
import './PopupForm.css';

interface SmallChangesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SmallChangesData) => void;
}

export interface SmallChangesData {
  title: string;
  description: string;
  targetArea: string;
  estimatedImpact: string;
  implementationTime: string;
  resourcesNeeded: string;
}

const SmallChangesForm: React.FC<SmallChangesFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<SmallChangesData>({
    title: '',
    description: '',
    targetArea: '',
    estimatedImpact: '',
    implementationTime: '',
    resourcesNeeded: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      title: '',
      description: '',
      targetArea: '',
      estimatedImpact: '',
      implementationTime: '',
      resourcesNeeded: ''
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content small-changes">
        <button className="popup-close" onClick={onClose}>×</button>
        
        <div className="popup-header">
          <div className="popup-icon">🎯</div>
          <h2>Small Changes, Big Impact</h2>
        </div>
        
        <p className="popup-description">
          Submit your idea for a targeted improvement that can be implemented quickly with high efficiency.
        </p>
        
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label htmlFor="title">Idea Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your idea a clear, concise title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your idea in detail"
              rows={4}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="targetArea">Target Area</label>
            <select
              id="targetArea"
              name="targetArea"
              value={formData.targetArea}
              onChange={handleChange}
              required
            >
              <option value="">Select a target area</option>
              <option value="energy">Energy Efficiency</option>
              <option value="water">Water Conservation</option>
              <option value="waste">Waste Reduction</option>
              <option value="materials">Material Optimization</option>
              <option value="process">Process Improvement</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="estimatedImpact">Estimated Impact</label>
            <input
              type="text"
              id="estimatedImpact"
              name="estimatedImpact"
              value={formData.estimatedImpact}
              onChange={handleChange}
              placeholder="e.g., 5% reduction in energy use, $1000 saved per month"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="implementationTime">Implementation Timeframe</label>
            <select
              id="implementationTime"
              name="implementationTime"
              value={formData.implementationTime}
              onChange={handleChange}
              required
            >
              <option value="">Select timeframe</option>
              <option value="immediate">Immediate (&lt; 1 week)</option>
              <option value="short">Short-term (1-4 weeks)</option>
              <option value="medium">Medium-term (1-3 months)</option>
              <option value="long">Long-term (3+ months)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="resourcesNeeded">Resources Needed</label>
            <input
              type="text"
              id="resourcesNeeded"
              name="resourcesNeeded"
              value={formData.resourcesNeeded}
              onChange={handleChange}
              placeholder="What resources would be required to implement this idea?"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit Idea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmallChangesForm; 