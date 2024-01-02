import React, { useState } from 'react';
import './ConsultNutritionist.css';
import { BASE_URL } from '../../url';

const SubscriptionModal = ({ onClose, onSubscribe, selectedMealPlanId }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvc: '',
  });

  const token = localStorage.getItem('token');
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubscribe =async () => {
   
    try {
       
         const response1 = await fetch(`${BASE_URL}/recepieSeeker/fill-nut-transaction/${selectedMealPlanId}`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`, 
           },
         });

         const response2 = await fetch(`${BASE_URL}/recepieSeeker/increase-subscription`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, 
            },
          });


     
         if (!response1.ok && !response2.ok) {
           const data1 = await response1.json();
           const data2 = await response2.json();
           console.error('Error subscribing:', data1.message);
           console.error('Error subscribing:', data2.message);
         } else {
   
           const Nut_Trans = await response1.json();
           const Recipe_seeker = await response2.json();
         
         }
       } catch (error) {
         console.error('Error subscribing:', error);
       }

   
    onSubscribe(selectedMealPlanId);
  };

  return (
    <div className="subscription-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose} style={{color:"black"}}>&times;</span>
        <h1 className=''>Subscribe to Unlock Meal Plans</h1>
        <h2 className='modal-content-h2'>By subscribng to this meal plan you will be charged an extra of Rs. 200 on your next Checkout</h2>
        
       
        <button className='modal-content-button' onClick={handleSubscribe}>Subscribe</button>
      </div>
    </div>
  );
};

export default SubscriptionModal;
