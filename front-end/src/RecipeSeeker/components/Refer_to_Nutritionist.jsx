import React, { useState , useEffect } from 'react';
import Navbar from './Navbar';
import './ConsultNutritionist.css';
import NutritionistList from './NutritionistList'
import  useTokenStore  from  '../../tokenStore.js'
import MealCard from './MealCard.jsx'

const ConsultNutritionist = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [showBMI, setShowBMI] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [mealplan, setMealPlan] = useState([]);
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
      const response = await fetch(`http://localhost:9000/recepieSeeker/sendNotification/${selectedNutritionist}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    // Call your meal plan route here and set the states accordingly
    const fetchMealPlansAndRecipes = async () => {
      try {
        const mealPlanResponse = await fetch('http://localhost:9000/recepieSeeker/mealPlans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!mealPlanResponse.ok) {
          throw new Error('Failed to fetch meal plans');
        }

        const mealPlanData = await mealPlanResponse.json();
        const mealPlansArray = mealPlanData.mealplan || [];

        // Now set the state
        setMealPlan(mealPlansArray);

     //   console.log("MealPlan : ", mealplan);
        // Assuming the meal plan object has a "recipes" field
     //   setRecipes(mealPlanData.recipes || []);
      } catch (error) {
        console.error('Error fetching meal plans:', error.message);
      }
    };

    fetchMealPlansAndRecipes();
  }, [token]);

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

      <div className="">
      {console.log('Meal Plan:', mealplan)}
        {mealplan.map((meal,index) => (
          <div key={index} className="mealplan-card">
            
            <div className="detailss">
            <h2>Customized Meal Plan</h2>
            <img
                src={meal.nutritionist.profilePicture}
                alt={`Nutritionist ${meal.nutritionist.name}`}
                style={{ width: '200px', height: '200px', borderRadius: '20px', borderRadius:"60%", marginLeft:"10%" }}
            />
            <h3 style={{marginLeft:"25%"}}>{meal.nutritionist.name}</h3>
            <h3 style={{marginLeft:"25%"}}>BMI: {meal.bmi}</h3>
            <h3 style={{marginLeft:"5%"}}>Calorie Range: {meal.calorieRange.min}-{meal.calorieRange.max}</h3>

            </div>
            
            {meal.recipes.map((recipe) => (
              <div key={recipe._id}>
                <MealCard recipe={recipe}
                
               />
              </div>
            ))}
            
          </div>
        ))}
       </div>

    </>
  );
};

export default ConsultNutritionist;
