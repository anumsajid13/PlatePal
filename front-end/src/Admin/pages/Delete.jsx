// ChefList.js

import React, { useEffect, useState } from 'react';
import { useStore } from './DeleteStore'; // assuming you have a store for managing state
import './ChefList.css';
import useTokenStore from '../../tokenStore';
import AdminNav from '../components/AdminNav';

const ChefList = () => {
  const { chefs, setChefs, setLoading } = useStore();
  const [error, setError] = useState(null);
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    const fetchAllChefs = async () => {
      try {
        setLoading(true);
        setError(null);
        // Make API call to fetch chefs
        const response = await fetch('http://localhost:9000/admin/list-all-chefs');
        const data = await response.json();
        setChefs(data);
        console.log("coo" ,data)
      } catch (error) {
        console.error(error);
        setError('Error fetching chefs');
      } finally {
        setLoading(false);
      }
    };

    fetchAllChefs();
  }, [setChefs, setLoading, setError]);

  const deleteChef = async (chefId) => {
    try {
      // Make API call to delete chef
      await fetch(`http://localhost:9000/delete-chef/${chefId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });

      // Update local state in the component
      setChefs((chefs) => chefs.filter((chef) => chef._id !== chefId));
    } catch (error) {
      console.error(error);
      // You might want to handle the error here (e.g., show a notification)
    }
  };

  const handleDelete = async (chefId, blockCount) => {
    if (blockCount > 3) {
      await deleteChef(chefId);
      setError('User Deleted');
    } else {
      setError('Block count is not above the limit yet');
    }
  };

  return (
    <><AdminNav /><div className="chef-list-container">
          <h1>Block Chefs</h1>
          {error && <p className="error">{error}</p>}
          {chefs.map((chef) => (
              <div key={chef._id} className="chef-item">
                  <p>{chef.name}</p>
                  <p>Block Count: {chef.blockCount}</p>
                  <button onClick={() => handleDelete(chef._id, chef.blockCount)}>Delete</button>
              </div>
          ))}
      </div></>
  );
};

export default ChefList;

