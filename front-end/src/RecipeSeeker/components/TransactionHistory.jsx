import React, { useEffect, useState } from 'react';
import './success.css'; 
import Navbar from './Navbar';
import useTokenStore from '../../tokenStore';

const TransactionComponent = () => {
  const token = localStorage.getItem('token');
  const { setToken } = useTokenStore();
  const [transactionHistory, setTransactionHistory] = useState(null);

  useEffect(() => {
    setToken(token);

    const fetchTransactionHistory = async () => {
      try {
        const response = await fetch('http://localhost:9000/recepieSeeker/allTransactions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const transactions = await response.json();
          setTransactionHistory(transactions);
        } else {
          console.error('Error fetching transaction history:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching transaction history:', error.message);
      }
    };

    fetchTransactionHistory();
  }, [setToken, token]);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Navbar activeLink="Discover" />
      <div className="success-container" style={{ marginTop: '7%' }}>
        {transactionHistory && transactionHistory.length > 0 ? (
          <>
            {transactionHistory.map(transaction => (
              <div key={transaction.OrderId} className="transaction-card" style={{marginTop:""}}>
                <h2 style={{color:"#F17228"}}>Transaction Details</h2>
                <p>Order ID: {transaction.OrderId}</p>
                <p>Checkout Date: {new Date(transaction.checkoutDate).toLocaleString()}</p>
                {new Date() > new Date(transaction.checkoutDate).getTime() + 60 * 60 * 1000 ? (
                    <p style={{color:"green"}}>Ordered has been delivered</p>
                ) : (
                    <p style={{color:"red"}}>To be Delivered within one hour</p>
                )}

                <h4>Recipes:</h4>
                <table  className="recipe-table" style={{backgroundColor:"white",border:"1px solid black"}}>
                  <thead>
                    <tr>
                      <th  style={{backgroundColor:"#ffe853"}}></th>
                      <th style={{backgroundColor:"#ffe853"}}>Name</th>
                      <th style={{backgroundColor:"#ffe853"}}>Quantity</th>
                      <th style={{backgroundColor:"#ffe853"}}>Price Pkr</th>

                    </tr>
                  </thead>
                  <tbody>
                    {transaction.recipes.map((recipe, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            style={{ width: '100px', height: '90px' }}
                            src={`data:${recipe.recipeId.recipeImage.contentType};base64,${recipe.recipeId.recipeImage.data}`}
                            alt={recipe.recipeId.name}
                          />
                        </td>
                        <td>{recipe.recipeId.title}</td>
                        <td>x {recipe.quantity}</td>
                        <td>{recipe.quantity * recipe.recipeId.price}</td>
                      </tr>
                    ))}
                    <tr>
                    <td></td>
                    <td></td>
                    
                    <td>Final Total:</td>
                    <td>{transaction.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </>
        ) : (
          <p>No transaction history found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionComponent;
