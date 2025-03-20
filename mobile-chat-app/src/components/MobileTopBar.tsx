import React, { useState, useEffect } from 'react';
import './MobileTopBar.css';

interface MobileTopBarProps {
  title?: string;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({ title = 'Chat' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mobile-top-bar">
      <div className="status-bar">
        <div className="status-bar-time">
          {currentTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
        </div>
        <div className="status-bar-icons">
          <div className="status-bar-wifi">WiFi</div>
          <div className="status-bar-signal">5G</div>
          <div className="status-bar-battery">
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="9" rx="1.5" stroke="currentColor"/>
              <rect x="2" y="2" width="11" height="6" fill="currentColor"/>
              <path d="M17 3.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="mobile-top-bar-content">
        <div className="mobile-top-bar-title">{title}</div>
      </div>
    </div>
  );
};

export default MobileTopBar; 