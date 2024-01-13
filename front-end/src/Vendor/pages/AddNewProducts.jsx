import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlusCircle } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import NavigationBar from '../components/NavigationBar';
import '../assets/styles/addNewProducts.css';
import defaultPicture from '../assets/images/vendor_signup_image.jpg';
import { BASE_URL } from '../../url';
const AddNewProduct = () => {
  const navigate = useNavigate();
  const { token } = useTokenStore();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0); 
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0); 
  const [limit, setLimit] = useState(0);
  const [stock, setStock] = useState(0);
  const [productImage, setProductImage] = useState({
    data: null, 
    contentType: '', 
  });
  const [unit, setUnit] = useState('1 kg'); 


  const handleAddIngredient = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('productImage', productImage);
    formData.append('unit', unit);
    formData.append('limit', limit);
    formData.append('stock', stock);
    console.log("formdata",formData)
    try {
      const response = await fetch(`${BASE_URL}/ingredients/new`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
       /*   " Content-Type": "multipart/form-data" */

        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add a new ingredient');
      }

      const newIngredient = await response.json();
      console.log('New ingredient added successfully:', newIngredient);
     alert('New ingredient added successfully');
      navigate('/Vendor/Mainpage');
    } catch (error) {
     alert(`Error adding a new ingredient:${error.message}`);
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
        <form className="formContainer">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
             onChange={(e) => { const enteredValue = e.target.value;
              if (enteredValue >= 0) {
                setPrice(enteredValue);
              }}}
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
             onChange={(e) => setDescription(e.target.value)}
            rows="4" 
          />

          <label htmlFor="type">Type:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={type}
             onChange={(e) => setType(e.target.value)}
          />

          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
             onChange={(e) => { const enteredValue = e.target.value;
              if (enteredValue >= 0) {
                setQuantity(enteredValue);
              }}}
          />
             <label htmlFor="unit">Unit:</label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={unit}
             onChange={(e) => setUnit(e.target.value)}
          />
          <label htmlFor="limit">Limit:</label>
        <input
          type="number"
          id="limit"
          name="limit"
          value={limit}
           onChange={(e) =>{ const enteredValue = e.target.value;
            if (enteredValue >= 0) {
              setLimit(enteredValue);
            }}}
        />
         <label htmlFor="stock">Refill Stock:</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={stock}
           onChange={(e) =>{ const enteredValue = e.target.value;
            if (enteredValue >= 0) {
              setStock(enteredValue);
            }}}
        />
            <label htmlFor='image'>
          Product Image:
          <input className='productImage' type="file" onChange={(e) => setProductImage(e.target.files[0])}  />
        </label>
          <button onClick={handleAddIngredient}>
           Add product
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNewProduct;
