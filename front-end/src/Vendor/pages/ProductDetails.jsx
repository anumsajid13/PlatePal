import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import '../assets/styles/productDetails.css';
import NavigationBar from '../components/NavigationBar';
import image from '../assets/images/vendor_signup_image.jpg';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/Vendor/Mainpage`);
  };
  const handleNext = () => {
    navigate(`/ingredients/editInfromation/${id}`);
  };
  return (
    <> 
    <NavigationBar/>
    <div className="ingredientDetailsContainer">
      <div className="header">
        <button className="backButton" onClick={handleClick}>
          <FaArrowLeft /> Back
        </button>
        {ingredient && (
          <>
            <img src={image} alt="ingredient" className="productimage" />
            
            <div className="iconContainer">
            <h2>{ingredient.name}</h2>
            <button className="editButton1" onClick={handleNext}>
                <FaEdit /> Edit Information
              </button>
            </div>
           
            <p>Description: {ingredient.description}</p>
            <p>Category: {ingredient.type}</p>
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
