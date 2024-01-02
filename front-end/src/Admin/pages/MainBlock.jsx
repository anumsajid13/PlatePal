import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './MainBlock.css'
import AdminNav from '../components/AdminNav';

const App = () => {
  return (

    <><AdminNav /><div className="container">
          <h1>Block Reports Dashboard</h1>
          <div className="block-reports-menu">
              <Link to="/admin/n-block" className="block-report-option">
                  View Nutrionist Block Reports
              </Link>

              <Link to="/admin/blockreport" className="block-report-option">
                  View Vendor Block Reports
              </Link>
          </div>
      </div></>
  );
};

export default App;
