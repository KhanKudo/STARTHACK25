import React from 'react';
import LoaderOne from './LoaderOne';
import './Loader.css';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  inline?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  fullScreen = false, 
  size = 'medium',
  inline = false
}) => {
  // For inline loaders or button loaders
  if (inline || (size === 'small' && !fullScreen)) {
    return <LoaderOne />;
  }
  
  // For full screen overlay
  if (fullScreen) {
    return (
      <div className="loading-overlay-clean">
        <LoaderOne />
      </div>
    );
  }
  
  // Default container loader
  return <LoaderOne />;
};

export default Loader; 