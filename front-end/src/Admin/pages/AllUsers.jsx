// AllUsers.js
import React, { useEffect } from 'react';
import useAllUsersStore from './AllUserStore';
import './AllUsers.css';
import AdminNav from '../components/AdminNav';
import useTokenStore from '../../tokenStore';
import useUserStore from '../../userStore';

const AllUsers = () => {
  const store = useAllUsersStore();
  const token = useTokenStore((state) => state.token);
  const setNut = useUserStore((state) => state.setNut);


  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Make API calls to fetch all users
        const vendorResponse = await fetch('http://localhost:9000/admin/list-registered-vendors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const nutritionistResponse = await fetch('http://localhost:9000/admin/list-registered-nutritionists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const chefResponse = await fetch('http://localhost:9000/admin/list-registered-chefs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        const vendorData = await vendorResponse.json();
        const nutritionistData = await nutritionistResponse.json();
        const chefData = await chefResponse.json();

        console.log(vendorData,"oo")
        console.log(chefData,"oo1")

        store.setRegisteredVendors(vendorData);
        store.setRegisteredNutritionists(nutritionistData);
        store.setRegisteredChefs(chefData);
        setNut(false);

      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    fetchAllUsers();
  }, [setNut]);

  return (

    <><AdminNav /><div className="outer-container1">

      <div className="chef-list">
        <div className="chef-category">
          <h2 className="list-title">Registered Chefs</h2>
          <div className="chef-card-container">
            {store.registeredChefs.map((chef) => (
              <div key={chef._id} className="chef-card">
                <p className="chef-details">Username: {chef.username}</p>
                <p className="chef-details">Email: {chef.email}</p>
                {/* Add other details specific to registered chefs */}
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="chef-list">
        <div className="chef-category">
          <h2 className="list-title">Registered Vendors</h2>
          <div className="chef-card-container">
            {store.registeredVendors.map((chef) => (
              <div key={chef._id} className="chef-card">
                <p className="chef-details">Username: {chef.username}</p>
                <p className="chef-details">Email: {chef.email}</p>
                {/* Add other details specific to registered chefs */}
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="chef-list">
        <div className="chef-category">
          <h2 className="list-title">Registered Nutrionists</h2>
          <div className="chef-card-container">
            {store.registeredNutritionists.map((chef) => (
              <div key={chef._id} className="chef-card">
                <p className="chef-details">Username: {chef.username}</p>
                <p className="chef-details">Email: {chef.email}</p>
                {/* Add other details specific to registered chefs */}
              </div>
            ))}
          </div>
        </div>
      </div>
    
    </div></>
  );
};

export default AllUsers;
