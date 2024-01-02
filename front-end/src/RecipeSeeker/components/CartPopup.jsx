// CartPopup.jsx
import React, { useState, useEffect } from 'react';
import  useTokenStore  from  '../../tokenStore.js'
import './Cardpopup.css';
import {loadStripe} from '@stripe/stripe-js';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '../../url';

const CartPopup = ({ onClose }) => {
  const [cartDetails, setCartDetails] = useState(null);
  const token = useTokenStore((state) => state.token);
  const [fetchdetails, setfetchdetails] = useState(false);
  const [subscriptionCount, setsubscriptionCount] = useState(0);
  const [IncreasedAmount, setIncreasedAmount] = useState(0);
  const [mealplansub,setmealplansub]=useState(0);
 
  const decodedToken = jwtDecode(token); 
  const currentUserId = decodedToken.id;
  localStorage.setItem('token', token);

  useEffect(() => {
    // Fetch cart details
    const fetchCartDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/recepieSeeker/cartDetails`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartDetails(data);

        } else {
          console.error('Failed to fetch cart details:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart details:', error.message);
      }
    };
    const fetchUserSubscriptionCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/recepieSeeker/get-subscription-count`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Subscription count: ", data)
          setsubscriptionCount(data.subscriptionCount);
          if(!(data.subscriptionCount===subscriptionCount))
          {       
            setIncreasedAmount((data.subscriptionCount-subscriptionCount) * 200);
          //  handleUpdateTotalAmount();
          }       
  
        } else {
          console.error('Failed to fetch Subscription Count:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching Subscription Count:', error.message);
      }
    };

    fetchUserSubscriptionCount()
    fetchCartDetails();
  }, [fetchdetails,IncreasedAmount]);


  
  const handleUpdateTotalAmount = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recepieSeeker/update-total-amount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ increasedAmount: IncreasedAmount }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error updating total amount:', data.message);
      } else {
        const updatedCart = await response.json();
        setmealplansub(IncreasedAmount);
        console.log('Updated Cart with extra amount:', updatedCart);
      }
    } catch (error) {
      console.error('Error updating total amount:', error);
    }
  };

  

  const handleRemoveItem = async (orderId) => {
    try {
      console.log(orderId)
      const response = await fetch(`${BASE_URL}/recepieSeeker/removeItem/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
         alert("Successfully removed from the card")
         setfetchdetails(true);
       // fetchCartDetails();
      } else {
        console.error('Failed to remove item from cart:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
    }
  };

  const handleCheckout = async() => {

    console.log()
    const stripe = await loadStripe('pk_test_51ORDf9SDTv76xgxgA5aRRcFyb38OZjtthrza5fmHNBT75xU1ypA6uPdjwH8ehAnGxRfn0NSUcItTe9XTdOvei7Eu004pHtYK53');
    const body = {
        products:cartDetails,
        userID:currentUserId
    }
    const headers = {
        "Content-Type":"application/json"
    }
    const response = await fetch(`${BASE_URL}/api/create-checkout-session`,{
        method:"POST",
        headers:headers,
        body:JSON.stringify(body)
    });

    const session = await response.json();

    const result = stripe.redirectToCheckout({
        sessionId:session.id
    });
    
    if(result.error){
        console.log(result.error);
    }
  };

  return (
    <>
    <div className="cart-popup">
      <div className="cart-popup-content">
        <span
          className="material-icons google-icon close-btn"
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        >
          close
        </span>
        <h2>Your Cart</h2>
        {cartDetails && (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartDetails.orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.items[0].name}</td>
                  <td>{order.items[0].quantity}</td>
                  <td>{order.items[0].price*order.items[0].quantity}</td>
                  <td>
                    {}
                    <span
                      className="material-icons google-icon"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveItem(order.items[0]._id)}
                    >
                      delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Display total price row */}
            
            <tfoot>
              <tr>
                <td colSpan="2"></td>
                <td>Total:</td>
                <td>{cartDetails.totalAmount + (subscriptionCount* 200)}</td>
              </tr>
            </tfoot>
            <tfoot>
              <tr>
                <td colSpan="2"></td>
                <td  >Meal Plan Subscription:</td>
                <td>{subscriptionCount*200}</td>
              </tr>
            </tfoot>
          </table>
        )}
        <div className="cart-actions">
          {/* Button for checkout */}
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  </>
  
  

  );
};

export default CartPopup;
