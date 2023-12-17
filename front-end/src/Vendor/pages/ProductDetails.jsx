import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import '../assets/styles/productDetails.css';
import NavigationBar from '../components/NavigationBar';

const IngredientDetails = () => {
  const { id } = useParams();
  const { token } = useTokenStore();
  const [ingredient, setIngredient] = useState(null);

  useEffect(() => {
    const fetchIngredientDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9000/ingredients/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ingredient details');
        }

        const ingredientData = await response.json();
        setIngredient(ingredientData);
      } catch (error) {
        console.error('Error fetching ingredient details:', error.message);
      }
    };

    fetchIngredientDetails();
  }, [id, token]);

  return (
    <> 
    <NavigationBar/>
    <div className="ingredientDetailsContainer">
      <div className="header">
        <Link to="/Vendor/Mainpage" className="backButton">
          <FaArrowLeft /> Back
        </Link>
        {ingredient && (
          <>
            <h2>
              {ingredient.name}
              <Link to={`/ingredients/editInfromation/${id}`} className="editButton">
                <FaEdit /> Edit Information
              </Link>
            </h2>
            <p>Description: {ingredient.description}</p>
            <p>Type: {ingredient.type}</p>
            <p>Price: {ingredient.price}</p>
            <p>Quantity: {ingredient.quantity}</p>
          </>
        )}
      </div>
    </div>
    </>
    
  );
};

export default IngredientDetails;
