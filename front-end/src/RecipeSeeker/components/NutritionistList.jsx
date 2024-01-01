import React, { useState, useEffect } from 'react';
import './ConsultNutritionist.css';
import './NutritionistPopup.css';
import NutritionistPopup from './Nutri_popup';

const NutritionistList = ({ onSelectNutritionist }) => {
  const [nutritionists, setNutritionists] = useState([]);
  const [selectedNutritionist, setSelectedNutritionist] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [followingNutIds, setFollowingNutIds] = useState([]);
  const token=localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:9000/recepieSeeker/allNutritionists');
        const data = await response.json();
        console.log("nutritionists data", data.nutritionists);
        setNutritionists(data.nutritionists);
  
        const followingResponse = await fetch('http://localhost:9000/recepieSeeker/nutritionist-followings', {
          headers: {
            method:'POST',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
  
          if (Array.isArray(followingData.followings)) {
            setFollowingNutIds(followingData.followings.map(Nut => Nut._id));
          } else {
            console.error('Invalid following nut data format');
            setFollowingNutIds([]);
          }
        } else {
          console.error('Failed to fetch following Nut:', followingResponse.status, followingResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [token]);

  const handleSelectNutritionist = (nutritionistId) => {


    setSelectedNutritionist(nutritionistId);
   
    console.log("nutritionist clicked: ",nutritionistId)
   
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };


  const handleSelectNutritionistName = (nutritionistId) => {


    setSelectedNutritionist(nutritionistId);
    setShowPopup(true);
    console.log("nutritionist clicked for opening popup: ",nutritionistId)
  };

  const handleSendNotification = () => {
    
    onSelectNutritionist(selectedNutritionist);
  
  };

  const toggleFollowChef = async (NutId) => {
    try {
      const response = await fetch(`http://localhost:9000/recepieSeeker/${followingNutIds.includes(NutId) ? 'unfollowNut' : 'followNut'}/${NutId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFollowingNutIds((prevFollowingNutIds) =>
          prevFollowingNutIds.includes(NutId)
            ? prevFollowingNutIds.filter((id) => id !== NutId)
            : [...prevFollowingNutIds, NutId]
        );
      } else {
        console.error('Failed to follow/unfollow Nut:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error following/unfollowing Nut:', error.message);
    }
  };


  return (
    <div className="nutritionist-list-container">
      <h2>Select Your Nutritionist</h2>
      <div className="nutritionist-list">
        {nutritionists ? (
          nutritionists.map((nutritionist) => (
            <div
              key={nutritionist._id}
              className={`nutritionist-item ${selectedNutritionist === nutritionist._id ? 'selected' : ''}`}
              
            >
              <img 
                onClick={() => handleSelectNutritionist(nutritionist._id)}
                src={nutritionist.profilePicture}
                alt={`Nutritionist ${nutritionist.name}`}
                style={{ width: '80px', height: '80px', borderRadius: '40px' }}
              />
              <h4 onClick={() => handleSelectNutritionistName(nutritionist._id)}>{nutritionist.name}</h4>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {showPopup && selectedNutritionist && (
        <>
        <div className="overlay-nut-popup"></div>
        <NutritionistPopup
          nutritionist={nutritionists.find((n) => n._id === selectedNutritionist)}
          onClose={handleClosePopup}
          isFollowingNut={selectedNutritionist && followingNutIds && followingNutIds.includes(selectedNutritionist)}
          onToggleFollow={() =>  selectedNutritionist && toggleFollowChef(selectedNutritionist)}
         
        />
      </>
      )}
      <button className="i-dont-know" style={{marginTop:"35px"}} onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
};

export default NutritionistList;
