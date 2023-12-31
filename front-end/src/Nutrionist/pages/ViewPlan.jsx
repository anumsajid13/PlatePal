// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Viewplan.css';
import useTokenStore from '../../tokenStore';
import { jwtDecode } from 'jwt-decode';
import NutNav from '../components/N-Nav';

const MealPlansPage = () => {
  const token = useTokenStore((state) => state.token);
  const [mealPlans, setMealPlans] = useState([]);
  const [notification, setNotification] = useState('');
  const [sentToUser, setSentToUser] = useState([]);
  const decodedToken = jwtDecode(token);
  const nutritionistId = decodedToken.id;
  const nutritionistName = decodedToken.name;

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await fetch(`http://localhost:9000/n/unsent-plans/${nutritionistId}`);

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
  }, [nutritionistId,notification]);

  const handleSendToUser = async (user, mealPlanId,name) => {
    try {

      const decodedToken = jwtDecode(token);
      const nutritionistName = decodedToken.name;
  
      const response = await fetch('http://localhost:9000/n/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user,
          type: 'meal plan',
          notification_text: `Meal plan sent by ${name}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      const data1 = await response.json();
      console.log('Notification response:', data1);
  

      // Update the 'seen' field to true for the meal plan
      const markSeenResponse = await fetch(`http://localhost:9000/n/mark-seen/${mealPlanId}`, {
        method: 'PUT',
      });

      if (!markSeenResponse.ok) {
        throw new Error('Failed to mark meal plan as seen');
      }

      setNotification(`Meal plan sent to user`);
       // Clear notification after 3 seconds (adjust as needed)
    setTimeout(() => {
      setNotification('');
    }, 3000);
    
      setSentToUser((prevSentToUser) => [...prevSentToUser, mealPlanId]);
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  };

  return (
    <><NutNav /><div className="meal-plans-page">
      <h2>Meal Plans</h2>

      {/* Notification message */}
      {notification && <div className="notification">{notification}</div>}

      {mealPlans.length === 0 ? (
        <p>No meal plans available</p>
      ) : (
        mealPlans.map((mealPlan) => (
          <div key={mealPlan._id} className="meal-plan-card">
            <p>BMI: {mealPlan.bmi}</p>
            <p>Calorie Range: {mealPlan.calorieRange.min} - {mealPlan.calorieRange.max}</p>
            <p>Date Created: {new Date(mealPlan.date).toLocaleDateString()}</p>
            <button
              className="ViewBtn"
              onClick={() => handleSendToUser(mealPlan.user._id, mealPlan._id,mealPlan.nutritionist.name)}
              disabled={sentToUser.includes(mealPlan._id)}
            >
              {sentToUser.includes(mealPlan._id) ? 'Sent' : 'Send to User'}
            </button>
          </div>
        ))
      )}
    </div></>
  );
};

export default MealPlansPage;
