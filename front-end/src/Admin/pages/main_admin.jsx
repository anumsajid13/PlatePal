import AdminNav from '../components/AdminNav';
import './main_admin.css';
import { useStore } from './TopStore';
import React, { useEffect } from 'react';

const Adminmain = () => {


  const { topChefs, topNutritionists, fetchTopChefs, fetchTopNutritionists } = useStore();

  useEffect(() => {
    fetchTopChefs();
   // fetchTopNutritionists();
  }, [fetchTopChefs]);


  return (
    <>
      <AdminNav />
      <div className="admin-content-container">
        {/* Left Side - Navigation Buttons */}
       

        {/* Middle Section - Top 5 Lists */}
        <div className="top-lists">
          <div className="top-chefs-list">
            <h2>Top Chefs</h2>
            {topChefs.map((chef) => {
              
              <div key={chef._id} className="list-item">
                <span>{chef.name}</span>
                <p>Total Followers: {chef.followers}</p>
              
              </div>
          })}
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
