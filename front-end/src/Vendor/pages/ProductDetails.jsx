import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import NavigationBar from '../components/NavigationBar';
import image from '../assets/images/vendor_signup_image.jpg';
import { useNavigate } from 'react-router-dom';
import{BASE_URL} from '../../url';

const IngredientDetails = () => {
  const { id } = useParams();
  const { token } = useTokenStore();
  const [ingredient, setIngredient] = useState(null);

  useEffect(() => {
    const fetchIngredientDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
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
        console.log(ingredientData);
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
          <><div className='imageContainer'>
             <img className="product-image" src={`data:image/jpeg;base64,${ingredient.productImage}`} alt="Ingredient" />
          </div>
            <div className="iconContainer">
            <h2>{ingredient.name}</h2>
            <button className="editButton1" onClick={handleNext}>
                <FaEdit /> Edit Information
              </button>
            </div>
            <label className="labelstyle">Description: {ingredient.description}</label>
        <label className="labelstyle labelstyle-category">Category: {ingredient.type}</label>
        <label className="labelstyle">Price: Pkr.{ingredient.price}</label>
        <label className="labelstyle">Quantity: {ingredient.quantity} packs ({ingredient.unit})</label>
        <label className="labelstyle">Limit: {ingredient.limit} </label>
        <label className="labelstyle">Refill stock: {ingredient.stock} </label>

          </>
        )}
      </div>
    </div>
    </>
    
  );
};

export default IngredientDetails;
