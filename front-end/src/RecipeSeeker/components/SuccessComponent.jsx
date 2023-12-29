import React, { useEffect, useState } from 'react';
import './success.css'; 
import Navbar from './Navbar';
import useTokenStore from '../../tokenStore';

const SuccessComponent = () => {
  const token = localStorage.getItem('token');
  const { setToken } = useTokenStore();
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    setToken(token);

    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch('http://localhost:9000/recepieSeeker/latestTransaction', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransactionDetails(data);
        } else {
          console.error('Error fetching transaction details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching transaction details:', error.message);
      }
    };

    fetchTransactionDetails();
  }, [setToken, token]);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Navbar activeLink="Discover" />
      <div className="success-container" style={{ marginTop: '0%' }}>
        <img src="https://i.gifer.com/7efs.gif" alt="Success" className="success-gif" />
        <h3 className="success-message">Payment was successful! </h3> 

        {transactionDetails && (
          <div className="transaction-card">
            <h2>Transaction Details</h2>
            <p>Order ID: {transactionDetails.OrderId}</p>
            <p>Checkout Date: {new Date(transactionDetails.checkoutDate).toLocaleString()}</p>
            <p style={{color:"red"}} >To be Delivered within one hour</p>

            <h3>Order Summary</h3>
            <table className="recipe-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Indivisual Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {transactionDetails.recipes.map((recipe, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={`data:${recipe.recipeId.recipeImage.contentType};base64,${recipe.recipeId.recipeImage.data}`}
                        alt={recipe.recipeId.name}
                      />
                    </td>
                    <td>{recipe.recipeId.title}</td>
                    <td>{recipe.quantity}</td>
                    <td>{recipe.recipeId.price}</td>
                    <td>{recipe.quantity * recipe.recipeId.price}</td>
                  </tr>
                ))}
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Final Total:</td>
                    <td>{transactionDetails.totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessComponent;
