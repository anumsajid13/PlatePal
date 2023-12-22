import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import '../assets/styles/indiviual_ingredients.css';
import { useNavigate } from 'react-router-dom';
import image from '../assets/images/vendor_signup_image.jpg';
const Indiviual = ({ ingredients, handleDelete, handleEdit }) => {
  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await handleDelete(ingredients._id);
  };
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/ingredients/${ingredients._id}`);
  };

  return (
    <div className="ingredientsContainer" onClick={handleClick}>
       <img src={image} alt="ingredients" className="Image" />
      <div className="iconContainer">
        <h3>{ingredients.name}</h3>
        <FaTrash className="deleteIcon" onClick={handleDeleteClick} />
      </div>
      <p className="description">{ingredients.description}</p>
      <p className="type">Category: {ingredients.type}</p>
      <p className="price">Price: {ingredients.price}</p>
      <p className="quantity">Quantity: {ingredients.quantity}</p>
    </div>
  );
};

export default Indiviual;
