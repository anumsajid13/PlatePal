import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import { useNavigate } from 'react-router-dom';
import RequestOverlay from '../pages/requestOverlay';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import NavigationBar from '../components/NavigationBar';
import { BASE_URL } from '../../url';

const CollaborationRequestCard = ({ request }) => {
  const [chefName, setChefName] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const { token } = useTokenStore();
  const [showOverlay, setShowOverlay] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(null);
  const navigate = useNavigate();
 



  const onDelete = async () => {
    try {
      // Call the server endpoint to delete collaboration requests
      const response = await fetch('${BASE_URL}/collaboration-request/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ collaborationRequestIds: [request._id] }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete collaboration request');
      }

      setDeletionSuccess(true);

      // Optionally, you can refresh the component or fetch updated collaboration requests
      // after successful deletion.
    } catch (error) {
      console.error('Error deleting collaboration request:', error);
      setDeletionSuccess(false);
    }
  };

  const openOverlay = () => {
    setShowOverlay(true);
  };

  useEffect(() => {
    const fetchChefName = async () => {
      try {
        const response = await fetch(`${BASE_URL}/collaboration-request/chef/${request.chef}`, {
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
        const response = await fetch(`${BASE_URL}/collaboration-request/recipe/${request.recipe}`, {
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
  }, [request.chef, request.recipe, token]);

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

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

 

  const formattedTime = new Date(request.Time).toLocaleString();
  console.log("isAccepted",request.isAccepted,"request",request,"chefid",request.chef);
  return (
    <>
      {showOverlay && (
        <RequestOverlay
          request={request}
          chefName={chefName}
          recipeName={recipeName}
          getStatusColor={getStatusColor}
          closeOverlay={closeOverlay}
        />
      )}
      <div className='request'>
       {/*  <input type='checkbox' checked={isChecked} onChange={handleCheckboxChange} /> */}
        <label onClick={openOverlay}>
          Chef {chefName} sent you a collaboration request for the recipe {recipeName}.
        </label>
        <div className='status'>
          <label className='normal'>Status:</label>
          <label style={{ color: getStatusColor(request.isAccepted) }}>{request.isAccepted}</label>
      
        </div>
        <label>Time: {formattedTime}</label>
      </div>
      {/* <button onClick={onDelete} disabled={!isChecked}>
        Delete Selected
      </button>
      {deletionSuccess === true && <p>Collaboration request deleted successfully</p>}
      {deletionSuccess === false && <p>Error deleting collaboration request</p>} */}
    </>
  );
};

export default CollaborationRequestCard;
