import React, { useEffect } from 'react';
import useChefStore from './blockUserstore';
import './AllUsers.css';
import AdminNav from '../components/AdminNav';
import useTokenStore from '../../tokenStore';

const ChefList = () => {
  const store = useChefStore();
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        // Make API call to fetch blocked chefs
        const chefResponse = await fetch('http://localhost:9000/admin/list-blocked-chefs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const chefData = await chefResponse.json();
        store.setBlockedChefs(chefData);

        // Make API call to fetch blocked vendors
        const vendorResponse = await fetch('http://localhost:9000/admin/list-blocked-vendors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const vendorData = await vendorResponse.json();
        store.setBlockedVendors(vendorData);

        // Make API call to fetch blocked nutritionists
        const nutritionistResponse = await fetch('http://localhost:9000/admin/list-blocked-nutritionists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const nutritionistData = await nutritionistResponse.json();
        store.setBlockedNutritionists(nutritionistData);

        console.log("Blocked Chefs:", chefData);
        console.log("Blocked Vendors:", vendorData);
        console.log("Blocked Nutritionists:", nutritionistData);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
      }
    };

    fetchBlockedUsers();
  }, [token, store]);

  return (
    <>
      <AdminNav />
      <div className="outer-container1">
        <div className="chef-list">
          <div className="chef-category">
            <h2 className="list-title">Blocked Chefs</h2>
            {store.blockedChefs.length === 0 ? (
              <p>No blocked chefs at the moment.</p>
            ) : (
              <div className="chef-card-container">
                {store.blockedChefs.map((chef) => (
                  <div key={chef._id} className="chef-card">
                     <div className="round-image">
                      <img
                        src={`data:${chef.profilePicture.contentType};base64,${chef.profilePicture.data}`}
                        alt={chef.username}
                      />
                      </div>
                    <p className="chef-details">Username: {chef.username}</p>
                    <p className="chef-details">Email: {chef.email}</p>
                    {/* Add other details specific to blocked chefs */}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chef-category">
            <h2 className="list-title">Blocked Vendors</h2>
            {store.blockedVendors.length === 0 ? (
              <p>No blocked vendors at the moment.</p>
            ) : (
              <div className="chef-card-container">
                {store.blockedVendors.map((vendor) => (
                  <div key={vendor._id} className="chef-card">
                     <div className="round-image">
                      <img
                        src={`data:${vendor.profilePicture.contentType};base64,${vendor.profilePicture.data}`}
                        alt={vendor.username}
                      />
                      </div>
                    <p className="chef-details">Username: {vendor.username}</p>
                    <p className="chef-details">Email: {vendor.email}</p>
                    {/* Add other details specific to blocked vendors */}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chef-category">
            <h2 className="list-title">Blocked Nutritionists</h2>
            {store.blockedNutritionists.length === 0 ? (
              <p>No blocked nutritionists at the moment.</p>
            ) : (
              <div className="chef-card-container">
                {store.blockedNutritionists.map((nutritionist) => (
                  <div key={nutritionist._id} className="chef-card">
                     <div className="round-image">
              <img
                src={`data:${nutritionist.profilePicture.contentType};base64,${nutritionist.profilePicture.data}`}
                alt={nutritionist.username}
              />
              </div>
                    <p className="chef-details">Username: {nutritionist.username}</p>
                    <p className="chef-details">Email: {nutritionist.email}</p>
                    {/* Add other details specific to blocked nutritionists */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChefList;
