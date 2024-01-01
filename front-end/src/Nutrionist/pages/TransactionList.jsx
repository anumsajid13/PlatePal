// TransactionList.js

import React, { useState, useEffect } from 'react';
import './TransactionList.css'; // Create a TransactionList.css file for styles
import useTokenStore from '../../tokenStore';
import { jwtDecode } from 'jwt-decode';
import NutNav from '../components/N-Nav';

const TransactionList = () => {
  const token = useTokenStore((state) => state.token);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const decodedToken = jwtDecode(token);
  const nutId = decodedToken.id;
  const nutName= decodedToken.username;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log(nutId,"wpwww")
        const response = await fetch(`http://localhost:9000/n/transactions/${nutId}`);
        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [nutId]);

  if (loading) {
    return <p className="loading-message">Loading transactions...</p>;
  }

  if (transactions.length === 0) {
    return <p className="no-transactions-message">No transactions found.</p>;
  }

  return (
    <><NutNav /><div className="transaction-list-container">
      <h2 className="header">Transactions for Nutritionist {nutName}</h2>
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction._id} className="transaction-item">
            <div>
              <strong>Sender:</strong> {transaction.sender.name}
            </div>
            <div>
              <strong>Paid:</strong> ${transaction.Paid}
            </div>
            <div>
              <strong>Meal Plan:</strong>{' '}
              {transaction.mealPlan.map((plan) => plan.PlanId.recipes.map(recipe => recipe.title).join(', ')).join(', ')}
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div></>
  );
};

export default TransactionList;
