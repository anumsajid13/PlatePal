import React from 'react';
import AdminNav from '../components/AdminNav';
import './main_admin.css';

const Adminmain = () => {
  return (
    <>
      <AdminNav />
      <div className="admin-content-container">
        {/* Left Side - Navigation Buttons */}
       

        {/* Middle Section - Top 5 Lists */}
        <div className="top-lists">
          <div className="top-chefs-list">
            <h2>Top Chefs</h2>
            <div className="list-item">
              <span>Chef 1</span>
              <p>Total Followers: 20</p>
            </div>
            <div className="list-item">
              <span>Chef 2</span>
              <p>Total Followers: 20</p>
            </div>
            <div className="list-item">
              <span>Chef 3</span>
              <p>Total Followers: 20</p>
            </div>
            <div className="list-item">
              <span>Chef 4</span>
              <p>Total Followers: 20</p>
            </div>
            <div className="list-item">
              <span>Chef 5</span>
              <p>Total Followers: 20</p>
            </div>
          </div>

          <div className="top-nutritionists-list">
            <h2>Top Nutritionists</h2>
            <div className="list-item">
              <span>Nutritionist 1</span>
              <p>Total Followers: 20</p>
            </div>
            <div className="list-item">
              <span>Nutritionist 2</span>
              <p>Total Followers: 20</p>
            </div>
            <div className="list-item">
              <span>Nutritionist 3</span>
              <p>Total Followers: 20</p>
            </div>
            <div className="list-item">
              <span>Nutritionist 4</span>
              <p>Total Followers: 20</p>
            </div>
            <div className="list-item">
              <span>Nutritionist 5</span>
              <p>Total Followers: 20</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminmain;
