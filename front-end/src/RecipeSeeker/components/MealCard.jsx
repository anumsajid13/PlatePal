// RecipeCard.jsx
import RecipeRating from './RecipeRating.jsx';
import { useState, useRef,useEffect } from 'react';
import './RecipeCard.css';
import  useTokenStore  from  '../../tokenStore.js'
import Comments from './Comments';
import Reviews from './Reviews';
import { jwtDecode } from 'jwt-decode';
import useCartStore from './cartStore'; 


const RecipeCard = ({ recipe }) => {

  const token = useTokenStore((state) => state.token);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(null);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const reviewInputRef = useRef(null);
  const decodedToken = jwtDecode(token); 
  const currentUserId = decodedToken.id;
  const [isRatingsVisible, setIsRatingsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  localStorage.setItem('token', token);
  
 

  console.log('Current decoded token:', decodedToken);
  console.log("recipe id: ",recipe._id )
  const handleCardClick = async () => {

    setIsPopupOpen(true);
    
    };
 
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };
  
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };


  function truncateText(text, limit) {
    if (text) {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  }
  return '';
  }


    const addToCart = async () => {
      try {
        const newItem = {
          recipe: recipe._id,
          name: recipe.title,
          price: recipe.price,
          quantity: quantity,
          chefId:recipe.chef,
          vendorId:recipe.vendor
        };
  
        console.log("recipe id sending: ",recipe._id)
        const response = await fetch('http://localhost:9000/recepieSeeker/addOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: [newItem] }),
        });
  
        if (response.ok) {
          console.log('Order added successfully');
          useCartStore.getState().addToCart(newItem);
        } else {
          console.error('Failed to add order:', response.status, response.statusText);
        }

      } catch (error) {
        console.error('Error adding order:', error.message);
      }
    
    
  };
 
  return (
    <>
       
        <div className="outer-recipe">
            <div className="recipe-card">
                <div className='relative-container'>
            
                <img   className="pagal-image " src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  / >   
                </div>
                <div className="flexxx">
                    <h3 onClick={handleCardClick}>
                        {recipe.title} by Chef {recipe.chef ? recipe.chef.name : 'Unknown Chef'}
                    </h3>
                    <p className='desc-para'>{truncateText(recipe.description, 20 )}</p>
                </div>
            </div>
        </div>
        
        <div className={`recipe-popup ${isPopupOpen ? 'popup-open' : ''}`}>
            <span className="material-icons google-icon close-btn" onClick={handleClosePopup} style={{cursor:"pointer"}}>close</span>

        <div className="recipe-details" style={{display:"flex"}}>
            
                <div className="recipe-details-left">
                    <img   className="pagal-image " src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  / >

            
                    <div className="top-chef-recipe-description">
                        <h2>Price:</h2>
                        <p className='chef-recipe-description'>Rs.{recipe.price}</p>  
                    </div>

            
                    <div className="chef-recipe-ingredients">
                            <h2>Ingredients:</h2>
                            <div className="ingredient-columns">
                            <ul className="ingredient-column">
                                {recipe.ingredients.slice(0, Math.ceil(recipe.ingredients.length / 2)).map((ingredient, index) => (
                                    <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                                ))}
                                </ul>
                                <ul className="ingredient-column">
                                {recipe.ingredients.slice(Math.ceil(recipe.ingredients.length / 2)).map((ingredient, index) => (
                                    <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                                ))}
                                </ul>
                            </div>
                    </div>
                    <div className="top-chef-recipe-description">
                        <h2>Allergens:</h2>
                        <ul className='chef-recipe-description'>
                            {recipe.allergens.map((allergen, index) => (
                            <li key={index}>{allergen.replace(/"/g, '')}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="chef-recipe-utensils">
                        <h2>Utensils:</h2>
                        <ul>
                            {recipe.utensils.map((utensil, index) => (
                            <li key={index}>{utensil.replace(/"/g, '')}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="chef-recipe-not-delivered">
                        <h2>Not included in your delivery:</h2>
                        <ul>
                            {recipe.notDelivered.map((item, index) => (
                            <li key={index}>{item.replace(/"/g, '')}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="chef-recipe-instructions">
                            <h2>Instructions:</h2>
                            <div className='chef-recipe-description'>
                                {recipe.instructions.map((instruction, index) => (
                                    <p key={index}>
                                        {instruction.replace(/"/g, '')}
                                    </p>
                                ))}
                            </div>
                    </div>

                    <button className="add-to-cart-button" onClick={addToCart}>
                    <span className="icon material-icons google-icon">shopping_cart</span>
                    Add to Cart
                    </button>

                    <div className="quantity-counter">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        />
                    </div>


            
                
                </div>
            
                
                <div className="recipe-details-right">
                        <h3 >{recipe.title}</h3>
                        <p className='recepie-category' style={{ color: "purple" }}>
                        Chef: {recipe.chef ? recipe.chef.name : 'Unknown Chef'}
                        </p>
                        <p className='recepie-category' style={{color:"purple"}}>Serving size: {recipe.servingSize}</p>
                        <p className='recepie-category' style={{color:"purple"}}>Calories: {recipe.calories}kcal</p>
                        <p className='recepie-category' style={{color:"purple"}}>Total Time: {recipe.totalTime} mins</p>
                        <p className='recepie-category' style={{color:"purple"}}>Difficulty: {recipe.difficulty.replace(/"/g, '')}</p>
                        <p>{recipe.description}</p>

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
                                {recipe.Nutrients.filter((nutrient) => nutrient.value !== 0).map((nutrient, index) => (
                                    <tr key={index}>
                                        <td>{nutrient.nutrientName}</td>
                                        <td>{parseFloat(nutrient.value).toFixed(1)}</td>
                                        <td>{nutrient.unitName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

        </div>
    </div>
      

    </>
  );
};

export default RecipeCard;
