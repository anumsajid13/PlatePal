import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './landingpage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
