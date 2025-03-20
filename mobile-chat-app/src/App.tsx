import React from 'react';
import './App.css';
import MobileContainer from './components/MobileContainer';
import MobileTopBar from './components/MobileTopBar';
import SwipeContainer from './components/SwipeContainer';

function App() {
  return (
    <div className="App">
      <MobileContainer>
        <MobileTopBar title="Virgin Interest Finder" />
        <SwipeContainer />
      </MobileContainer>
    </div>
  );
}

export default App;
