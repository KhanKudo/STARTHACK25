import React from 'react';
import './MobileTopBar.css';

interface MobileTopBarProps {
  title?: string;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({ title = 'Chat' }) => {
  return (
    <div className="mobile-top-bar">
      <div className="status-bar">
        <div className="status-bar-time">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="status-bar-icons">
          <div className="status-bar-battery">100%</div>
          <div className="status-bar-wifi">WiFi</div>
          <div className="status-bar-signal">5G</div>
        </div>
      </div>
      <div className="mobile-top-bar-content">
        <div className="mobile-top-bar-title">{title}</div>
      </div>
    </div>
  );
};

export default MobileTopBar; 