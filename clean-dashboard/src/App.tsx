import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ProjectDetails from './components/ProjectDetails';
import ChatPage from './components/ChatPage';
import CollaboratePage from './components/CollaboratePage';
import KnowledgeCenter from './components/KnowledgeCenter';
import CompanyPage from './components/CompanyPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/chat/:projectId" element={<ChatPage />} />
          <Route path="/chat/:employeeId/:employeeName/:employeeCompany" element={<ChatPage />} />
          <Route path="/collaborate" element={<CollaboratePage />} />
          <Route path="/knowledge" element={<KnowledgeCenter />} />
          <Route path="/company/:companyId" element={<CompanyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
