
import React from 'react';
import useTokenStore from '../../tokenStore';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft,FaTimes } from 'react-icons/fa';
import NavigationBar from '../components/NavigationBar';
import{useState,useEffect} from 'react';
import RequestOverlay from '../pages/requestOverlay';
import {BASE_URL} from '../../url';


const CollaborationCard = ({ collaboration }) => {
  console.log("collaboration",collaboration);
  const [chefName, setChefName] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const { token } = useTokenStore();
  const [showOverlay, setShowOverlay] = useState(false);

  const openOverlay = () => {
    setShowOverlay(true);
  };
  useEffect(() => {
    const fetchChefName = async () => {
      try {
        const response = await fetch(`${BASE_URL}/collaboration-request/chef/${collaboration.chef}`, {
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
        const response = await fetch(`${BASE_URL}/collaboration-request/recipe/${collaboration.recipe}`, {
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
  }, [collaboration.chef, collaboration.recipe]);



  const closeOverlay = () => {
    setShowOverlay(false);
  };
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
 
  const formattedTime = new Date(collaboration.Time).toLocaleString();
     return (
      <>
      {showOverlay && (
        <RequestOverlay
         request={collaboration}
          chefName={chefName}
          recipeName={recipeName}
          getStatusColor={getStatusColor}
          closeOverlay={closeOverlay}
        />
      )}
        
        <div  className='request'  onClick={openOverlay} >
      <label>You are collaborating with Chef {chefName} on the recipe {recipeName}</label>
      <label>Time: {formattedTime}</label>
    </div>
      </>
    );
        };


  export default CollaborationCard;
  