import React, { useState, useEffect } from 'react';
import './chefcollabreqs.css';
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore';
import { BASE_URL } from '../../url';

const ChefCollabs = () => {
    const [collabRequests, setCollabRequests] = useState([]);
   // const { token, setToken } = useTokenStore(); 

   const token = localStorage.getItem('token');
   
    useEffect(() => {
       
        const fetchCollabs = async () => {
            try {
                const response = await fetch(`${BASE_URL}/chefVendors/collabRequests`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, 
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch followers');
                }

                const data = await response.json();
                console.log(data.collabRequests)
                setCollabRequests(data.collabRequests);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCollabs();
    }, []);

    return (
        <>
      <ChefNav />
      <div className="chef-collab-list">
        <h2 className='chef-collab-heading'>Chef Collabs</h2>
        <div className='chef-collab-list-item'>
          {collabRequests.length > 0 ? (
            collabRequests.map((collab, index) => (
              <div className="chef-collab-names" key={index}>
                <h2 className='chef-collab-heading2'>Vendor:</h2>
                <p className='chef-collab-names-text'>{collab.vendor.name}</p>
                <h2 className='chef-collab-heading2'>Chef:</h2>
                <p className='chef-collab-names-text'>{collab.chef.name}</p>
                <h2 className='chef-collab-heading2'>Recipe:</h2>
                <p className='chef-collab-names-text'>{collab.recipe.title.replace(/"/g, '')}</p>
                <h2 className='chef-collab-heading2'>Ingredients:</h2>
                <ul>
                  {collab.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient.name}</li>
                  ))}
                </ul>
                <h2 className='chef-collab-heading2'>Status:</h2>
                <p className='chef-collab-names-text'>{collab.isAccepted}</p>
                <h2 className='chef-collab-heading2'>Time:</h2>
                <p className='chef-collab-names-text'>{new Date(collab.Time).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <div className="no-collabs">
              <p>No vendor collabs yet</p>
            </div>
          )}
        </div>
      </div>
    </>
    );

};

export default ChefCollabs;