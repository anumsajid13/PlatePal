// Adminmain.js
import AdminNav from '../components/AdminNav';
import './main_admin.css';
import { useStore } from './TopStore';
import React, { useEffect } from 'react';

const Adminmain = () => {
  const { topChefs, topNutritionists, topVendors, fetchTopChefs, fetchTopNutritionists, fetchTopVendors } = useStore();

  useEffect(() => {
    // Make the API calls
    const fetchData = async () => {
      try {
        const chefResponse = await fetch('http://localhost:9000/admin/top-chefs');
        const chefData = await chefResponse.json();
        fetchTopChefs(chefData.topChefs); // Set the topChefs array
        console.log(chefData.topChefs, "YAAAAAAA");

        const nutritionistResponse = await fetch('http://localhost:9000/admin/top-nutritionists');
        const nutritionistData = await nutritionistResponse.json();
        fetchTopNutritionists(nutritionistData.topNutritionists); // Set the topNutritionists array

        const vendorResponse = await fetch(`http://localhost:9000/admin/top-vendors`);
        const vendorData = await vendorResponse.json();
        console.log(vendorData);
        fetchTopVendors(vendorData.topVendors); // Set the topVendors array
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, [fetchTopChefs, fetchTopNutritionists, fetchTopVendors]);

  return (
    <>
      <AdminNav />
    <div className='out'>
      <div className="admin-content-container">
        {/* Left Side - Navigation Buttons */}

        {/* Middle Section - Top 5 Lists */}
        <div className="top-lists">
          <div className="top-chefs-list">
            <h2>Top Chefs</h2>
            {topChefs.map((chef) => (
              <div key={chef._id} className="list-item">
                <div className="chef-profile">
                {console.log("picture data", chef.profilePicture)}
                  {chef.profilePicture && chef.profilePicture.contentType && (
                    <img
                      src={`data:${chef.profilePicture.contentType};base64,${chef.profilePicture.data}`}
                      alt={chef.name}
                      className="rounded-profile-image"
                    />
                  )}
                  <span>{chef.username}</span>
                </div>
                <p>Total Followers: {chef.followers}</p>
              </div>
            ))}
          </div>

          <div className="top-nutritionists-list">
            <h2>Top Nutritionists</h2>
            {topNutritionists.map((nutritionist) => (
              <div key={nutritionist._id} className="list-item">
                <div className="nutritionist-profile">
                {nutritionist.profilePicture && nutritionist.profilePicture.contentType && (
                    <img
                      src={`data:${nutritionist.profilePicture.contentType};base64,${nutritionist.profilePicture.data}`}
                      alt={nutritionist.name}
                      className="rounded-profile-image"
                    />
                  )}
                  <span>{nutritionist.username}</span>
                </div>
                <p>Total Followers: {nutritionist.followers}</p>
              </div>
            ))}
          </div>


          <div className="top-nutritionists-list">
            <h2>Top Vendors</h2>
            {topVendors.map((nutritionist) => (
              <div key={nutritionist._id} className="list-item">
                <div className="nutritionist-profile">
                {console.log("picture data", nutritionist.profilePicture)}
                {nutritionist.profilePicture && nutritionist.profilePicture.contentType && (
                    <img
                      src={`data:${nutritionist.profilePicture.contentType};base64,${nutritionist.profilePicture.data}`}
                      alt={nutritionist.name}
                      className="rounded-profile-image"
                    />
                  )}
                  <span>{nutritionist.username}</span>
                </div>
                <p>Total Collabrators: {nutritionist.collabNum}</p>
              </div>
            ))}
          </div>

        
          
        </div>
      </div>
      </div>
    </>
  );
};

export default Adminmain;
