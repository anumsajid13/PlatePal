// ChefList.js

import React, { useEffect, useState } from 'react';
import { useStore } from './DeleteStore'; // assuming you have a store for managing state
import './ChefList.css';
import useTokenStore from '../../tokenStore';
import AdminNav from '../components/AdminNav';
import useBlockStore from './blockstore';
import BlockReports from './BlockReports';

const ChefList = () => {

  const { blockReports, setBlockReports } = useBlockStore();

  const { chefs, setChefs, setLoading, nutri, vendor, setVendor, setNutri } = useStore();
  const [error, setError] = useState(null);
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const chefResponse = await fetch('http://localhost:9000/admin/list-all-chefs');
        const chefData = await chefResponse.json();
        setChefs(chefData);

        const vendorResponse = await fetch('http://localhost:9000/admin/list-all-vendors');
        const vendorData = await vendorResponse.json();
        setVendor(vendorData);

        const nutriResponse = await fetch('http://localhost:9000/admin/list-all-nutritionists');
        const nutriData = await nutriResponse.json();
        setNutri(nutriData);

        console.log("coo", chefData);
      } catch (error) {
        console.error(error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [setChefs, setLoading, setError, setVendor, setNutri,blockReports]);

  const deleteEntity = async (entityType, entityId, blockCount) => {
    try {
      // Check if blockCount is greater than zero
      if (blockCount > 3) {
        // Make API call to delete entity based on the type (chef, vendor, nutritionist)
        const response = await fetch(`http://localhost:9000/admin/delete-${entityType}/${entityId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Trigger a refetch of the data from the server after successful deletion
          setError(`User (${entityType}) deleted successfully`);
        } else {
          setError(result.error || 'Error deleting user');
        }
      } else {
        setError(`Block count for user (${entityType}) is not greater than 3`);
      }
    } catch (error) {
      console.error(error);
      setError('Error deleting user');
    }
  };
  

  return (
    <>
      <AdminNav />
      <div className="chef-list-container">
        <h1>Delete Chefs</h1>
        {error && <p className="error">{error}</p>}
        {chefs.map((chef) => (
          <div key={chef._id} className="chef-item">
            <p>{chef.username}</p>
            <p>Block Count: {chef.blockCount}</p>
            <button className="delete-button" onClick={() => deleteEntity('chef', chef._id, chef.blockCount)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="chef-list-container">
        <h1>Delete Vendors</h1>
        {error && <p className="error">{error}</p>}
        {vendor.map((vendor) => (
          <div key={vendor._id} className="chef-item">
            <p>{vendor.username}</p>
            <p>Block Count: {vendor.blockCount}</p>
            <button className="delete-button" onClick={() => deleteEntity('vendor', vendor._id, vendor.blockCount)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="chef-list-container">
        <h1>Delete Nutritionists</h1>
        {error && <p className="error">{error}</p>}
        {nutri.map((nutritionist) => (
          <div key={nutritionist._id} className="chef-item">
            <p>{nutritionist.username}</p>
            <p>Block Count: {nutritionist.blockCount}</p>
            <button className="delete-button" onClick={() => deleteEntity('nutritionist', nutritionist._id, nutritionist.blockCount)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChefList;
