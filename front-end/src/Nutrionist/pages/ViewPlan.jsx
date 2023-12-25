// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Viewplan.css';
import useTokenStore from '../../tokenStore';
import { jwtDecode } from 'jwt-decode';

const MealPlansPage = () => {
  const token = useTokenStore((state) => state.token);
  const [mealPlans, setMealPlans] = useState([]);
  const decodedToken = jwtDecode(token); 
  const nutritionistId  = decodedToken.id;
  const nutritionistName = decodedToken.name; // Replace with the actual property name in your token

  useEffect(() => {
    // Fetch meal plans for the specific nutritionist
    const fetchMealPlans = async () => {
      try {
        const response = await fetch(`http://localhost:9000/n/planmade/${nutritionistId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch meal plans');
        }

        const data = await response.json();
        setMealPlans(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMealPlans();
  }, [nutritionistId]);

  const handleSendToUser = async (user) => {
    try {
      // Send a notification with a customized text
      const response = await fetch('http://localhost:9000/n/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user,
          type: 'mealPlan',
          notification_text: `Meal plan sent by ${nutritionistName}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      const data = await response.json();
      console.log(data); // Handle the response as needed

      // Implement additional logic if needed after sending the notification
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  };

  return (
    <div className="meal-plans-page">
      <h2>Meal Plans</h2>
      {mealPlans.length === 0 ? (
        <p>No meal plans available</p>
      ) : (
        mealPlans.map((mealPlan) => (
          <div key={mealPlan._id} className="meal-plan-card">
            {/* <h3>Meal Plan for User: {mealPlan.user.username}</h3> */}
            <p>BMI: {mealPlan.bmi}</p>
            <p>Calorie Range: {mealPlan.calorieRange.min} - {mealPlan.calorieRange.max}</p>
            <p>Date Created: {new Date(mealPlan.date).toLocaleDateString()}</p>
            <button className = "ViewBtn" onClick={() => handleSendToUser(mealPlan.user._id)}>Send to User</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MealPlansPage;
