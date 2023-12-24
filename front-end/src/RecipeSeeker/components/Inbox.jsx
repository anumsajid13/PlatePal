// components/InboxPage.js
import React, { useState } from 'react';
import NutritionistChat from './NutritionistChat';
import ChefChat from './ChefChat';
import Navbar from './Navbar'; 

const InboxPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
    <Navbar activeLink="Discover" />
    <div className="inbox-page">
      <div className="inbox-sidebar">
        <div className="inbox-options" style={{marginTop:'3%'}}>
          <span
            onClick={() => handleOptionClick('nutritionist')}
            style={{
              cursor: 'pointer',
              padding: '10px 20px',
              marginRight: '20px',
              marginLeft:'450px',
              color:"purple",
              borderRadius: '5px',
              backgroundColor: selectedOption === 'nutritionist' ? '#888' : '#e6dddd',
             
            }}
          >
            Chat with Nutritionist
          </span>
          <span
            onClick={() => handleOptionClick('chef')}
            style={{
              cursor: 'pointer',
              padding: '10px 20px',
              borderRadius: '5px',
              color:"purple",
              backgroundColor: selectedOption === 'chef' ? '#888' : '#e6dddd',
             
            }}
          >
            Chat with Chef
          </span>
        </div>
      </div>
      <div className="inbox-main">
        {selectedOption === 'nutritionist' && <NutritionistChat />}
        {selectedOption === 'chef' && <ChefChat />}
      </div>
    </div>

    </>
  );
};

export default InboxPage;
