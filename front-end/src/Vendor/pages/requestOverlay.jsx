import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import { FaTimes } from 'react-icons/fa';
import '../assets/styles/overlay.css';
import { BASE_URL } from '../../url';

const RequestOverlay = ({ request, chefName, recipeName, closeOverlay, getStatusColor }) => {
  const { token } = useTokenStore();
  const [loading, setLoading] = useState(false);
  const [ingredientNames, setIngredientNames] = useState([]);

  const fetchIngredientNames = async () => {
    try {
      const response = await fetch(`${BASE_URL}/collaboration/names`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredientIds: request.ingredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ingredient names');
      }

      const data = await response.json();
      setIngredientNames(data.names);
    } catch (error) {
      console.error('Error fetching ingredient names:', error);
    }
  };

  useEffect(() => {
    fetchIngredientNames();
  }, [request.ingredients, token]);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/collaboration-request/${request._id}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        alert(`Failed to ${action} collaboration request due to the error:${response.json}`);
        throw new Error(`Failed to ${action} collaboration request`);
      }
alert("Collaboration request has been "+action+"ed");

  

    } catch (error) {
      console.error(`Error ${action} collaboration request:`, error);
    } finally {
      setLoading(false);
   
    }
  
  };

  const formattedTime = new Date(request.Time).toLocaleString();

  return (
    <div className='requestoverlay'>
      <div className='closeicon' onClick={closeOverlay}>
        <FaTimes />
      </div>
      {request.isAccepted==null || undefined ? (
  <h2 >Collaboration</h2>
) : (
  <h2 >Collaboration Request</h2>
)}

  
      <label>Chef: {chefName}</label>
      <label>Recipe: {recipeName}</label>

      {(request.isAccepted==null || undefined) && (
        <>
          <ul>
            <label>Ingredients:</label>
            {ingredientNames.map((ingredientName, index) => (
              <li key={index}>{ingredientName}</li>
            ))}
          </ul>
          
        </>
      )}

{(request.isAccepted !=null || undefined) && (
  <> <ul>
  <label>Ingredients:</label>
  {request.ingredients.map((ingredient, index) => (
      <li key={index}>{ingredient.name}</li>
  ))}
  </ul>
   <div className='status'>
  <label className='normal'>Status:</label>
  <label style={{ color: getStatusColor(request.isAccepted) }}>{request.isAccepted}</label>
</div>
</>
 
)}
      <label>Time: {formattedTime}</label>

      {request.isAccepted === 'pending' && (
        <div className='buttonarea'>
          <button className='accepted' onClick={() => handleAction('accept')} disabled={loading}>
            Accept
          </button>
          <button className='declined' onClick={() => handleAction('decline')} disabled={loading}>
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestOverlay;
