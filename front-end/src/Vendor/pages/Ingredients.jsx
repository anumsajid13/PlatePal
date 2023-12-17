import React from 'react';
import '../assets/styles/indiviual_ingredients.css';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import icons from Font Awesome

const Indiviual = ({  ingredients }) => {
  return (
    <div className="ingredientsContainer">
       <div className="iconContainer">
        <FaTrash className="deleteIcon"  />
        <FaEdit className="editIcon" />
      </div>
      <span role="img" aria-label="icon">
      🍲
      </span>
      <h3>{ingredients.name}</h3>
      <p>{ingredients.description}</p>
      <p>Type: {ingredients.type}</p>
      <p>Price: {ingredients.price}</p>
      <p>Quantity: {ingredients.quantity}</p>
   

    </div>
  );
};

export default Indiviual;
