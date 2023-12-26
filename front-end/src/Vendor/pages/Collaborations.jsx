import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import CollaborationCard from '../components/CollaborationCard';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';


const CollaborationsList = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useTokenStore();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        
        
        const response = await fetch('http://localhost:9000/collaboration', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
            },
            });
        if(!response.ok) {
            throw new Error('Failed to fetch collaborations');
          }
        const data = await response.json();
       
        setCollaborations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collaborations:', error);
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);
const handleClick = () => {

    navigate('/Vendor/Mainpage');
};
  return (
    <>
     <NavigationBar />
        
          <div className="Requestheader">
        <button onClick={handleClick} className="backButton">
          <FaArrowLeft /> Back
        </button>
        <h1>Collaborations List</h1>
        </div>
  
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {collaborations.map(collaboration => (
            <CollaborationCard  key={collaboration._id} collaboration={collaboration} />
          ))}
        </div>
      )}
  
     
    </>
  
  );
};

export default CollaborationsList;
