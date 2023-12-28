import React, { useState, useEffect } from 'react';
import './ConsultNutritionist.css';
import './NutritionistPopup.css';
import NutritionistPopup from './Nutri_popup';

const NutritionistList = ({ onSelectNutritionist }) => {
  const [nutritionists, setNutritionists] = useState([]);
  const [selectedNutritionist, setSelectedNutritionist] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Fetch nutritionists data from your backend endpoint
    fetch('http://localhost:9000/recepieSeeker/allNutritionists')
      .then((response) => response.json())
      .then((data) => {
        console.log("nutritionists data", data.nutritionists)
        setNutritionists(data.nutritionists)
      })
      .catch((error) => console.error('Error fetching nutritionists:', error));
  }, []);

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
                style={{ width: '40px', height: '40px', borderRadius: '20px' }}
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
          onFollow={(id) => console.log(`Follow clicked for Nutritionist ${id}`)}
        />
      </>
      )}
      <button className="i-dont-know" style={{marginTop:"35px"}} onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
};

export default NutritionistList;
