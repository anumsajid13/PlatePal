import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlusCircle } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import NavigationBar from '../components/NavigationBar';
import '../assets/styles/addNewProducts.css';

const AddNewProduct = () => {
  const navigate = useNavigate();
  const { token } = useTokenStore();

  const [data, setData] = useState({
    name: '',
    price: 0,
    description: '',
    type: '',
    quantity: 0,
    constituentsOf: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Ensure quantity and price are not below zero
    const sanitizedValue = name === 'quantity' || name === 'price' ? Math.max(0, parseInt(value, 10)) : value;

    setData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  const handleAddIngredient = async () => {
    try {
      const response = await fetch('http://localhost:9000/ingredients/new', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add a new ingredient');
      }

      const newIngredient = await response.json();
      console.log('New ingredient added successfully:', newIngredient);

      navigate('/Vendor/Mainpage');
    } catch (error) {
      console.error('Error adding a new ingredient:', error.message);
    }
  };

  const handleGoBack = () => {
    navigate('/Vendor/Mainpage');
  };

  return (
    <>
      <NavigationBar />
      <div className="addIngredientContainer">
        <div className="header">
          <button className="backButton" onClick={handleGoBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <h2>Add New Ingredient</h2>
        <div className="formContainer">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            onChange={handleInputChange}
          />

          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={data.price}
            onChange={handleInputChange}
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleInputChange}
            rows="7" 
          />

          <label htmlFor="type">Type:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={data.type}
            onChange={handleInputChange}
          />

          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={data.quantity}
            onChange={handleInputChange}
          />
          <button onClick={handleAddIngredient}>
           Add product
          </button>
        </div>
      </div>
    </>
  );
};

export default AddNewProduct;
