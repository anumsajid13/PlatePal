import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import '../assets/styles/indiviual_ingredients.css';
import { useNavigate } from 'react-router-dom';
import image from '../assets/images/vendor_signup_image.jpg';

const Indiviual = ({ ingredients, handleDelete, handleEdit }) => {
  const navigate = useNavigate();


  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const userConfirmed = window.confirm("Are you sure you want to delete this ingredient?");

  if (userConfirmed) {
    await handleDelete(ingredients._id);
  } else {
    console.log("Deletion canceled by the user");
  }
  };

  const handleClick = () => {
    navigate(`/ingredients/${ingredients._id}`);
  };

  return (
    <div className="ingredientsContainer" onClick={handleClick}>
     
   <img  className="productimage"  src={`data:image/jpeg;base64,${ingredients.productImage.data}`} />

      <div className="iconContainer">
        <h3>{ingredients.name}</h3>
        <FaTrash className="deleteIcon" onClick={handleDeleteClick} />
      </div>

      <p className="description">Description:{ingredients.description}</p>
      <p className="type">Category: {ingredients.type}</p>
      <p className="price">Price: Pkr. {ingredients.price}</p>
      <p className="quantity">Quantity: {ingredients.quantity} packs ({ingredients.unit})</p>
    </div>
  );
};

export default Indiviual;
