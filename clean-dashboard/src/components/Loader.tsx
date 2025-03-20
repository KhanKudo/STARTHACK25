import React from 'react';
import './Loader.css';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  inline?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  fullScreen = false, 
  message = 'Loading...', 
  size = 'medium',
  inline = false
}) => {
  // Set sizes based on the size prop
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'loader-small';
      case 'large': return 'loader-large';
      default: return '';
    }
  };
  
  // For inline loaders
  if (inline) {
    return (
      <div className={`loader ${getSizeClass()}`} />
    );
  }
  
  // For button loaders
  if (size === 'small' && !fullScreen) {
    return (
      <span className="button-loader" />
    );
  }
  
  // For full screen overlay
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className={`loader ${getSizeClass()}`} />
          {message && <div className="loading-message">{message}</div>}
        </div>
      </div>
    );
  }
  
  // Default container loader
  return (
    <div className="loading-container" style={{ margin: '20px auto' }}>
      <div className={`loader ${getSizeClass()}`} />
      {message && <div className="loading-message">{message}</div>}
    </div>
  );
};

export default Loader; 