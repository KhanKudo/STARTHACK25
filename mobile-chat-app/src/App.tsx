import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MobileContainer from './components/MobileContainer';
import MobileTopBar from './components/MobileTopBar';
import SwipeContainer from './components/SwipeContainer';
import ChatPage from './components/ChatPage';
import ProjectDetailsPage from './components/ProjectDetailsPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/chat/:projectId" element={
            <MobileContainer>
              <ChatPage />
            </MobileContainer>
          } />
          <Route path="/project/:projectId" element={
            <MobileContainer>
              <ProjectDetailsPage />
            </MobileContainer>
          } />
          <Route path="/" element={
            <MobileContainer>
              <MobileTopBar title="Virgin Interest Finder" />
              <SwipeContainer />
            </MobileContainer>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
