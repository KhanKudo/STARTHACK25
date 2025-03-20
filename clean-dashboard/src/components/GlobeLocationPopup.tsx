import React from 'react';
import './GlobeLocationPopup.css';

interface GlobeLocationPopupProps {
  company: string;
  initiative: string;
  link: string;
  position: { x: number; y: number };
  onClose: () => void;
}

const GlobeLocationPopup: React.FC<GlobeLocationPopupProps> = ({ 
  company, 
  initiative, 
  link, 
  position, 
  onClose 
}) => {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent popup from closing when clicking the link
    window.open(link, '_blank');
  };

  return (
    <div 
      className="globe-location-popup" 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px` 
      }}
    >
      <button className="close-button" onClick={onClose}>×</button>
      <h3>{company}</h3>
      <p>{initiative}</p>
      <button className="link-button" onClick={handleLinkClick}>
        Visit Website
      </button>
    </div>
  );
};

export default GlobeLocationPopup; 