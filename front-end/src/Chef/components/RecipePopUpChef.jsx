import  {React, useState } from 'react';
import useTokenStore from '../../tokenStore';
import '../components/RecipePopUpChef.css';
import RatingStars from './RatingStars';
import { useNavigate } from 'react-router-dom';
import {BASE_URL} from '../../url';

const RecipePopUpChef = ({ selectedRecipe, setSelectedRecipe, onDelete  }) => {

    const navigate = useNavigate();

    //const { token, setToken } = useTokenStore(); 

    const token = localStorage.getItem('token');

    if (!selectedRecipe) return null;

    const handleDelete = async () => {
        try {
           
            await fetch(`${BASE_URL}/recipes/delete/${selectedRecipe._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
            });

            //invoke onDelete function to update recipes state in main page
            onDelete(selectedRecipe._id);
            setSelectedRecipe(null);
        } catch (error) {
            console.error('Error deleting recipe:', error);
            
        }
    };

    const handleGroupIconClick = (recipeId) => {
        navigate(`/Chef/AllVendors/${recipeId}`);
      };

    console.log(selectedRecipe);


    return(

     <>
           
           <div className="chef-recipe-popup-container">
            <div className="chef-recipe-popup">
                <div className="chef-recipe-image-container">
                    <img src={`data:image/jpeg;base64,${selectedRecipe.recipeImage.data}`} className="chef-recipe-image" alt="Recipe" />
                    <div className="chef-recipe-details">
                        <h2 className="chef-recipe-title">{selectedRecipe.title.replace(/"/g, '')}</h2>
                        <p className="chef-recipe-chef">By Chef {selectedRecipe.chefName}</p>
                    </div>
                    <button className="chef-pop-close-btn" onClick={() => setSelectedRecipe(null)}>
                        <span className="material-icons">close</span>
                    </button>


            </div>
            <div className='chef-popup-three-content'>
                    <div className='chef-popup-content-item'>
                        <p>Total Time: {selectedRecipe.totalTime} mins</p>
                    </div>
                    <div className='chef-popup-content-item'>
                        <p>Calories: {selectedRecipe.calories}</p>
                    </div>
                    <div className="chef-popup-content-item">
                        <p>Difficulty: {selectedRecipe.difficulty}</p>
                    </div>
                </div>

                <div className='chef-popup-three-content'>
                    <button  className='update-delete-collab-chef' onClick={handleDelete}>
                        <span className="material-icons">delete</span>
                    </button>
                    <button  className='update-delete-collab-chef'  onClick={() => handleGroupIconClick(selectedRecipe._id)}>
                        <span className="material-icons">groups</span>
                    </button>
                 </div>


            <div className="top-chef-recipe-description">
                <h2>Description:</h2>
                <p className='chef-recipe-description'>{selectedRecipe.description.replace(/"/g, '')}</p>  
            </div>



            
            <div className="top-chef-recipe-description">
                <h2>Price:</h2>
                <p className='chef-recipe-description'>Rs.  {selectedRecipe.price}</p>  
            </div>

            
            <div className="top-chef-recipe-description">
                <h2>Allergens:</h2>
                <ul className='chef-recipe-description'>
                    {selectedRecipe.allergens.map((allergen, index) => (
                    <li key={index}>{allergen.replace(/"/g, '')}</li>
                    ))}
                </ul>
            </div>

          

            <div className="chef-recipe-ingredients">
            <h2>Ingredients:</h2>
            <div className="ingredient-columns">
                <ul className="ingredient-column">
                {selectedRecipe.ingredients.slice(0, Math.ceil(selectedRecipe.ingredients.length / 2)).map((ingredient, index) => (
                    <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                ))}
                </ul>
                <ul className="ingredient-column">
                {selectedRecipe.ingredients.slice(Math.ceil(selectedRecipe.ingredients.length / 2)).map((ingredient, index) => (
                    <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                ))}
                </ul>
            </div>
            </div>

            <div className="chef-recipe-not-delivered">
            <h2>Not included in your delivery:</h2>
            <ul>
                {selectedRecipe.notDelivered.map((item, index) => (
                <li key={index}>{item.replace(/"/g, '')}</li>
                ))}
            </ul>
            </div>

            <div className="chef-recipe-utensils">
            <h2>Utensils:</h2>
            <ul>
                {selectedRecipe.utensils.map((utensil, index) => (
                <li key={index}>{utensil.replace(/"/g, '')}</li>
                ))}
            </ul>
            </div>
            <div className="chef-recipe-instructions">
                    <h2>Instructions:</h2>
                    <div className='chef-recipe-description'>
                        {selectedRecipe.instructions.map((instruction, index) => (
                            <p key={index}>
                                {instruction.replace(/"/g, '')}
                            </p>
                        ))}
                    </div>
            </div>

            <div className="chef-recipe-nutrients">
                <h2>Nutrients:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nutrient</th>
                            <th>Value</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedRecipe.Nutrients.filter((nutrient) => nutrient.value !== 0).map((nutrient, index) => (
                            <tr key={index}>
                                <td>{nutrient.nutrientName}</td>
                                <td>{parseFloat(nutrient.value).toFixed(1)}</td>
                                <td>{nutrient.unitName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="chef-recipe-comments">
                    <h2>Comments:</h2>
                     <ul>
                        {selectedRecipe.comments.map((comment, index) => (
                            <li key={index} className="chef-comment-item">
                                <div className="chef-comment-header">
                                    {comment.user && comment.user.profilePicture && ( 
                                        <img src={comment.user.profilePicture} alt="User" className="user-image" />
                                    )}
                                    <div className="chef-user-details">
                                        <p className="chef-user-name">{comment.user ? comment.user.name : 'Unknown'}</p>
                                        <p className="chef-comment-time">{new Date(comment.Time).toLocaleString()}</p>
                                       
                                    </div>
                                </div>
                                <p className="chef-comment-text">{comment.comment}</p>
                            </li>
                        ))}
                    </ul>
            </div>
            <div className="chef-recipe-ratings">
                    <h2>Ratings:</h2>
                    <ul>
                        {selectedRecipe.ratings.map((rating, index) => (
                            <li key={index} className="chef-comment-item">
                                <div className="chef-comment-header">
                                    {rating.user && rating.user.profilePicture && ( 
                                        <img src={rating.user.profilePicture} alt="User" className="user-image" />
                                    )}
                                    <div className="chef-user-details">
                                        <p className="chef-user-name">{rating.user ? rating.user.name : 'Unknown'}</p>
                                        <p className="chef-comment-time">{new Date(rating.Time).toLocaleString()}</p>
                                       
                                    </div>
                                </div>
                                <p className="chef-comment-text"> <RatingStars ratingNumber={rating.ratingNumber} /></p>
                            </li>
                        ))}
                    </ul>
                   
            </div>
            

  </div>
</div>
    </>
    );


};



export default RecipePopUpChef;