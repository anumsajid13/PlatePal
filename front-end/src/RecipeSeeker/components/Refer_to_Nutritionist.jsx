import React, { useState } from 'react';
import Navbar from './Navbar';
import './ConsultNutritionist.css'; 

const ConsultNutritionist = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState(null);

  const calculateBMI = () => {
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (!isNaN(weightValue) && !isNaN(heightValue) && heightValue > 0) {
      const bmiValue = weightValue / Math.pow(heightValue, 2);
      setBMI(bmiValue.toFixed(2));
    } else {
      setBMI(null);
    }
  };

  return (
    <>
      <Navbar activeLink="Discover" />
      <div className="bmi-calculator-card">
        <h2>BMI Calculator</h2>
        <div className="input-container">
          <label className="input-container-label" htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="calculator-input-container">
          <label className="input-container-label" htmlFor="height">Height (m):</label>
          <input style={{marginLeft:'0px'}}
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <button className="calculate-button" onClick={calculateBMI}>
          Calculate BMI
        </button>
        {bmi !== null && (
          <div className="result-container">
            <p>Your BMI: {bmi}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultNutritionist;
