import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/editProductInfo.css';
import NavigationBar from '../components/NavigationBar';

const EditIngredient = () => {
  const { id } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState({
    name: '',
    price: 0,
    description: '',
    type: '',
    quantity: 0,
    constituentsOf: [],
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIngredient((prevIngredient) => ({
      ...prevIngredient,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:9000/ingredients/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredient),
      });

      if (!response.ok) {
        throw new Error('Failed to update ingredient');
      }
      navigate(`/ingredients/${id}`);
      console.log('Ingredient updated successfully');
    } catch (error) {
      console.error('Error updating ingredient:', error.message);
    }
  };
const goBack = () => {
    navigate(`/ingredients/${id}`);
};
  return (
    <>
     <NavigationBar />
     <div className="editIngredientContainer">
     <div className="header">
        <button onClick={goBack} className="backButton">
          <FaArrowLeft /> Back
        </button>
        </div>
      <h2>Edit Ingredient Information</h2>
      <div className="formContainer">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={ingredient.name}
          onChange={handleInputChange}
        />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={ingredient.price}
          onChange={handleInputChange}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={ingredient.description}
          onChange={handleInputChange}
        />

        <label htmlFor="type">Type:</label>
        <input
          type="text"
          id="type"
          name="type"
          value={ingredient.type}
          onChange={handleInputChange}
        />

        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={ingredient.quantity}
          onChange={handleInputChange}
        />

        <button onClick={handleUpdate}>Update Ingredient</button>
      </div>
    </div>
    </>
   
  );
};

export default EditIngredient;
