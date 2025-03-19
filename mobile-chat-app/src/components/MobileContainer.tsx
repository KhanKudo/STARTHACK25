import React, { ReactNode } from 'react';
import './MobileContainer.css';

interface MobileContainerProps {
  children: ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="mobile-viewport">
      <div className="mobile-container">
        <div className="mobile-content">
          {children}
        </div>
        <div className="mobile-notch" />
      </div>
    </div>
  );
};

export default MobileContainer; 