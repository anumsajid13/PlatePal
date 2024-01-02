import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/editProductInfo.css';
import NavigationBar from '../components/NavigationBar';
import { BASE_URL } from '../../url';

const EditIngredient = () => {
  const { id } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0); 
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0); 
  const [limit, setLimit] = useState(0);
  const [stock, setStock] = useState(0);
  const [productImage, setProductImage] = useState(null);
  const [newproductImage, setNewproductImage] = useState(null);
  const [unit, setUnit] = useState('1 kg'); 

  const handleproductImageChange = (e) => {
    const file = e.target.files[0];
    setNewproductImage(file);

 
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {

      fetch(`${BASE_URL}/ingredients/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setPrice(data.price);
        setType(data.type);
        setDescription(data.description);
        setQuantity(data.quantity);
        setUnit(data.unit);
        setLimit(data.limit);
        setStock(data.stock);
          setProductImage(data.productImage);

      })
      .catch((error)=> {
        alert(`Error fetching ingredient details:${error.message}`);
      });
    }, [id, token]);  
  


    const handleUpdate = async (e) => {
      e.preventDefault();
    
      const updatedIngredient = {
        name,
        price,
        type,
        description,
        quantity,
        unit,
        limit,
        stock
      };
    console.log("updatedIngredient",updatedIngredient);
      const formData = new FormData();
      formData.append('productImage', newproductImage);  
      formData.append('ingredientData', JSON.stringify(updatedIngredient)); // Append JSON data
    console.log("formdata",formData);
      try {
        const response = await fetch(`${BASE_URL}/ingredients/update/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
    
        const data = await response.json();
       alert('Ingredient updated successfully');
       navigate(`/ingredients/${id}`)

      } catch (error) {
       alert(`Error updating ingredient:${ error.message }`);
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
    <form onSubmit={handleUpdate}>
    <h2>Edit Ingredient Information</h2>
      <div className="formContainer">
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
           onChange={(e) => {
             const enteredValue = e.target.value;
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
           onChange={(e) =>{ const enteredValue = e.target.value;
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
           onChange={(e) => setUnit(e.target.value)}/>
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
        <label htmlFor=" ">productImage:</label>
          <input style={{ marginLeft: "20%", border: "none" }}
              type="file"
              id="productImage"
              accept="image/*"
              onChange={handleproductImageChange}
            />
        <button type='submit'>Update Ingredient</button>
      </div>
    </form>
    
    </div>
    </>
   
  );
};

export default EditIngredient;
