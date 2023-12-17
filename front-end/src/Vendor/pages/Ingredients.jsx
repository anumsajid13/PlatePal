import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../assets/styles/indiviual_ingredients.css';

const Indiviual = ({ ingredients, handleDelete, handleEdit }) => {
  const handleDeleteClick = async () => {
    await handleDelete(ingredients._id);
  };
  return (
    <Link to={`/edit-ingredient/${ingredients.id}`} className='incontainer' >
      <div className="ingredientsContainer">
        <div className="iconContainer">
          <FaTrash className="deleteIcon" onClick={handleDeleteClick}  />
        </div>
        <h3>{ingredients.name}</h3>
        <p>{ingredients.description}</p>
        <p>Type: {ingredients.type}</p>
        <p>Price: {ingredients.price}</p>
        <p>Quantity: {ingredients.quantity}</p>
      </div>
    </Link>
  );
};

export default Indiviual;
