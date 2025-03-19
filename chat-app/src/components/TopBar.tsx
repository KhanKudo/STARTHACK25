import React from 'react';
import './TopBar.css';

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard' }) => {
  return (
    <div className="top-bar">
      <div className="top-bar-title">{title}</div>
    </div>
  );
};

export default TopBar; 