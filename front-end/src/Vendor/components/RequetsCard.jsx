import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';

const CollaborationRequestCard = ({ request }) => {
  const [chefName, setChefName] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const { token } = useTokenStore();

  useEffect(() => {
  
    const fetchChefName = async () => {
      try {
        const response = await fetch(`http://localhost:9000/collaboration-request/chef/${request.chef}`, {
          method: 'GET',
          headers: {
    
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chef name');
        }

        const data = await response.json();
        setChefName(data.chefName || 'Chef Not Found');
      } catch (error) {
        console.error('Error fetching chef name:', error);
      }
    };

    const fetchRecipeName = async () => {
      try {
        const response = await fetch(`http://localhost:9000/collaboration-request/recipe/${request.recipe}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipe name');
        }

        const data = await response.json();
        setRecipeName(data.recipeName || 'Recipe Not Found');
      } catch (error) {
        console.error('Error fetching recipe name:', error);
      }
    };

    fetchChefName();
    fetchRecipeName();
  }, [request.chef, request.recipe]);
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'purple';
      case 'accepted':
        return 'green';
      case 'declined':
        return 'red';
      default:
        return '';
    }
  };
  return (
    <div className='request'>
      <label>{chefName} sent you a collaboration request for the recipe {recipeName}.</label>
      
      <div className='status'>
        <label className='normal'>Status:</label>
        <label style={{ color: getStatusColor(request.isAccepted) }}>{request.isAccepted}</label>
      </div>
      <label>Time:{request.Time}</label>
    </div>
  );
};

export default CollaborationRequestCard;
