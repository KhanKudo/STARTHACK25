import React from 'react';
import TopBar from './TopBar';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <TopBar title="Chat Dashboard" />
      <div className="dashboard-content">
        {/* Content will be added later */}
      </div>
    </div>
  );
};

export default Dashboard; 