import React, { useEffect } from 'react';
import useChefStore from './AllUserStore';
import './AllUsers.css';
import AdminNav from '../components/AdminNav';

const ChefList = () => {
  const store = useChefStore();

  useEffect(() => {
    const fetchBlockedChefs = async () => {
      try {
        
        // Make API call to fetch chefs
        const response = await fetch('http://localhost:9000/admin/list-blocked-chefs');
        const data = await response.json();
        store.setBlockedChef(data);
  
        console.log("coo", data);
      } catch (error) {
        console.error('Error fetching Blocked Chefs:', error);
      } 
    };
  
    fetchBlockedChefs();
  }, []);
  

  return (

    <><AdminNav /><div className="outer-container">

      <div className="chef-list">

        <div className="chef-category">
          <h2 className="list-title">Blocked Chefs</h2>
          <div className="chef-card-container">
            {store.blockedChefs.map((chef) => (
              <div key={chef._id} className="chef-card">
                <p className="chef-details">Username: {chef.username}</p>
                <p className="chef-details">Email: {chef.email}</p>
                {/* Add other details specific to blocked chefs */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div></>
  );
};

export default ChefList;
