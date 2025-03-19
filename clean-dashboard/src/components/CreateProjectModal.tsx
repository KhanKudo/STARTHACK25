import React, { useState } from 'react';
import { Project } from '../utils/projectData';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
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
            <label htmlFor="company">Company*</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="initiative">Initiative*</label>
            <input
              type="text"
              id="initiative"
              name="initiative"
              value={formData.initiative}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="challenge">Challenge*</label>
            <textarea
              id="challenge"
              name="challenge"
              value={formData.challenge}
              onChange={handleChange}
              rows={3}
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
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="callToAction">Call to Action</label>
            <textarea
              id="callToAction"
              name="callToAction"
              value={formData.callToAction}
              onChange={handleChange}
              rows={2}
            />
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
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button">Save Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal; 