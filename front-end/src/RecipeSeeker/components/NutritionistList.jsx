import React, { useState, useEffect } from 'react';
import './ConsultNutritionist.css';

const NutritionistList = ({ onSelectNutritionist }) => {
  const [nutritionists, setNutritionists] = useState([]);
  const [selectedNutritionist, setSelectedNutritionist] = useState(null);

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
              <p>{nutritionist.name}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <button style={{marginTop:"35px"}} onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
};

export default NutritionistList;
