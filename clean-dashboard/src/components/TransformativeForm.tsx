import React, { useState } from 'react';
import './PopupForm.css';

interface TransformativeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransformativeData) => void;
}

export interface TransformativeData {
  title: string;
  description: string;
  challenge: string;
  potentialSolution: string;
  expectedImpact: string;
  timeToImplement: string;
  stakeholders: string;
  resources: string;
}

const TransformativeForm: React.FC<TransformativeFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<TransformativeData>({
    title: '',
    description: '',
    challenge: '',
    potentialSolution: '',
    expectedImpact: '',
    timeToImplement: '',
    stakeholders: '',
    resources: ''
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
      challenge: '',
      potentialSolution: '',
      expectedImpact: '',
      timeToImplement: '',
      stakeholders: '',
      resources: ''
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content transformative">
        <button className="popup-close" onClick={onClose}>×</button>
        
        <div className="popup-header">
          <div className="popup-icon">🌱</div>
          <h2>Transformative Solutions</h2>
        </div>
        
        <p className="popup-description">
          Share your vision for addressing major sustainability challenges with innovative, transformative solutions.
        </p>
        
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label htmlFor="title">Initiative Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your initiative a clear, inspiring title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Brief Overview</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a brief overview of your transformative idea"
              rows={3}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="challenge">Challenge Addressed</label>
            <textarea
              id="challenge"
              name="challenge"
              value={formData.challenge}
              onChange={handleChange}
              placeholder="What specific sustainability challenge does your idea address?"
              rows={3}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="potentialSolution">Potential Solution</label>
            <textarea
              id="potentialSolution"
              name="potentialSolution"
              value={formData.potentialSolution}
              onChange={handleChange}
              placeholder="Describe the solution and how it would work"
              rows={4}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expectedImpact">Expected Impact</label>
            <textarea
              id="expectedImpact"
              name="expectedImpact"
              value={formData.expectedImpact}
              onChange={handleChange}
              placeholder="Quantify the potential environmental, social, and economic impacts"
              rows={3}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="timeToImplement">Implementation Timeline</label>
            <select
              id="timeToImplement"
              name="timeToImplement"
              value={formData.timeToImplement}
              onChange={handleChange}
              required
            >
              <option value="">Select timeline</option>
              <option value="short">Short-term (6-12 months)</option>
              <option value="medium">Medium-term (1-3 years)</option>
              <option value="long">Long-term (3-5 years)</option>
              <option value="verylong">Very long-term (5+ years)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="stakeholders">Key Stakeholders</label>
            <input
              type="text"
              id="stakeholders"
              name="stakeholders"
              value={formData.stakeholders}
              onChange={handleChange}
              placeholder="List organizations, communities, and groups that should be involved"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="resources">Resources Needed</label>
            <textarea
              id="resources"
              name="resources"
              value={formData.resources}
              onChange={handleChange}
              placeholder="Describe funding, partnerships, expertise, or other resources needed"
              rows={3}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit Initiative
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransformativeForm; 