import React, { useState } from 'react';
import Navbar from './Navbar';
import './ConsultNutritionist.css';
import NutritionistList from './NutritionistList'
import  useTokenStore  from  '../../tokenStore.js'

const ConsultNutritionist = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBMI] = useState(null);
    const [showBMI, setShowBMI] = useState(false);
    const [selectedNutritionist, setSelectedNutritionist] = useState(null);
    const token = useTokenStore((state) => state.token);


  const calculateBMI = () => {
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (!isNaN(weightValue) && !isNaN(heightValue) && heightValue > 0) {
      const bmiValue = weightValue / Math.pow(heightValue, 2);
      setBMI(bmiValue.toFixed(2));
      setShowBMI(true);
    } else {
      setBMI(null);
      setShowBMI(false);
    }
  };

  const handleSelectNutritionist = async (nutritionistId) => {
    setSelectedNutritionist(nutritionistId);
  
    try {

        console.log('nut id:', selectedNutritionist )
      const response = await fetch(`http://localhost:9000/recepieSeeker/sendNotification/${selectedNutritionist}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
          notification_text: 'Send Meal Plan',
          bmi: bmi, 
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.error('Error sending notification:', data.message);
      
      } else {
        const data = await response.json();
        console.log('Notification sent successfully:', data.message);
       
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      
    }
  };
  return (
    <>
      <Navbar activeLink="Discover" />
      <div className="bmi-nutritionist-container">
      <div className="bmi-calculator-card">
        <h2>BMI Calculator</h2>
        <div className="input-container">
          <label className="input-container-label" htmlFor="weight">
            Weight (kg):
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="calculator-input-container">
          <label className="input-container-label" htmlFor="height">
            Height (m):
          </label>
          <input
            style={{ marginLeft: '0px' }}
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <button className="calculate-button" onClick={calculateBMI}>
          Calculate BMI
        </button>
        {showBMI && (
          <div className="result-container">
            <p>Your BMI: {bmi}</p>
          </div>
        )}
      </div>
      <NutritionistList onSelectNutritionist={handleSelectNutritionist} />
      </div>
    </>
  );
};

export default ConsultNutritionist;
