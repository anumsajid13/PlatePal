// RecipeCard.jsx
import RecipeRating from './RecipeRating.jsx';
import { useState, useRef,useEffect } from 'react';
import './RecipeCard.css';
import  useTokenStore  from  '../../tokenStore.js'
import Comments from './Comments';
import Reviews from './Reviews';
import { jwtDecode } from 'jwt-decode';
import useCartStore from './cartStore'; 


const RecipeCard = ({ recipe, isFollowingChef = false, onToggleFollow,isTodayRecipe = false }) => {

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
  const [isInFavorites, setIsInFavorites] = useState(false);
  localStorage.setItem('token', token);
  
  const imageData = new Uint8Array(recipe.recipeImage.data).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ''
  );

   

  console.log('Recipe Image Data:', imageData);

  console.log('Current decoded token:', decodedToken);
  console.log("recipe id: ",recipe._id )

  useEffect(() => {
    // Check if the recipe is in favorites when the component mounts
    const checkFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:9000/recepieSeeker/is-in-favorites/${recipe._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const { isInFavorites } = await response.json();
          setIsInFavorites(isInFavorites);
        } else {
          console.error('Failed to check if recipe is in favorites:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error checking if recipe is in favorites:', error.message);
      }
    };
  
    checkFavorites();
  }, [currentUserId, recipe._id, token]);

  const handleAddToFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:9000/recepieSeeker/add-to-favourites/${recipe._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log('Recipe added to favorites successfully');
        setIsInFavorites(true);
      } else {
        console.error('Failed to add recipe to favorites:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding recipe to favorites:', error.message);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:9000/recepieSeeker/remove-from-favourites/${recipe._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log('Recipe removed from  favorites successfully');
        setIsInFavorites(false);
      } else {
        console.error('Failed to remove recipe from favorites:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error removing recipe from favorites:', error.message);
    }
  };
  const handleCardClick = async () => {
    try {
      const ratingResponse = await fetch(
        `http://localhost:9000/recepieSeeker/ratings/${recipe._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const commentResponse = await fetch(
        `http://localhost:9000/recepieSeeker/comments/${recipe._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ReviewResponse = await fetch(
        `http://localhost:9000/recepieSeeker/reviews/${recipe._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (ratingResponse.ok && commentResponse.ok && ReviewResponse.ok) {
        const ratingData = await ratingResponse.json();
        const commentData = await commentResponse.json();
        const reviewData = await ReviewResponse.json();

        
        setRatings(ratingData.ratings);
        setComments(commentData.comments);
        setReviews(reviewData.reviews)
        console.log("Comments: ", commentData.comments)
        setIsPopupOpen(true);
      } else {
        console.error(
          'Failed to fetch ratings or comments:',
          ratingResponse.status,
          ratingResponse.statusText,
          commentResponse.status,
          commentResponse.statusText,
          ReviewResponse.status,
          ReviewResponse.statusText
        );
      }
    } catch (error) {
      console.error('Error fetching ratings or comments:', error.message);
    }
  };
 
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };
  
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:9000/recepieSeeker/addComment/${recipe._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commentText  }),
      });

      if (response.ok) {
        console.log('Comment added successfully');
        
        setComments([...comments, { commentText, user: 'You', time: new Date() }]);
        setCommentText('');
      } else {
        console.error('Failed to add comment:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };


  const handleReviewSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:9000/recepieSeeker/addReview/${recipe._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewText }),
      });

      if (response.ok) {
        console.log('Reviews added successfully');
        
        setReviews([...reviews, { reviewText, user: 'You', time: new Date() }]);
        setReviewText('');
      } else {
        console.error('Failed to add Review:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding Reviews:', error.message);
    }
  };


  const handleSaveRating = async (recipeId, selectedRating) => {
    try {
      const response = await fetch(`http://localhost:9000/recepieSeeker/rateRecipe/${recipeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ratingNumber: selectedRating }),
      });
  
      if (response.ok) {
        console.log(`Recipe ${recipeId} rated with ${selectedRating} stars`);
  
        setRatings(ratings.filter((rating) => rating.user_id !== currentUserId));

        const updatedRatingResponse = await fetch(
          `http://localhost:9000/recepieSeeker/ratings/${recipeId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (updatedRatingResponse.ok) {
          const updatedRatingData = await updatedRatingResponse.json();
          setRatings(updatedRatingData.ratings);
        } else {
          console.error(
            'Failed to fetch updated ratings:',
            updatedRatingResponse.status,
            updatedRatingResponse.statusText
          );
        }
      } else {
        console.error('Failed to save rating:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving rating:', error.message);
    }
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

      if(recipe.vendor!== undefined)
      {

        try {
          const newItem = {
            recipe: recipe._id,
            name: recipe.title,
            price: recipe.price,
            quantity: quantity,
            chefId:recipe.chef,
            vendorId:recipe.vendor,
          };
          
          console.log("item: ",recipe._id)
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
      
      
      }
      else
      {
        alert("Recipe not available yet! It is pending Vendor collaboration")
      }
      
  };
 
  return (
    <>
       
      <div className={`outer-recipe ${isPopupOpen ? 'popup-open' : ''}`}>
        <div className={`recipe-card ${isTodayRecipe ? 'today-recipe' : ''}`}>
          <div className='relative-container'>
          
          <img   className="pagal-image " src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  / >
          <button className="follow-chef-button" onClick={onToggleFollow}>
            {isFollowingChef && 'Following'}
            {!isFollowingChef && 'Follow Chef'}
          </button>
         
           
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

        <div className="recipe-details">
        
            <div className="recipe-details-left">
            <img   className="" src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}   />

            <div className="add-to-favorites">
              {isInFavorites ? (
                <>
                     <img style={{ width:"30px" ,height:"30px"}} className="add-to-favorites-img" src="/filled-heart.svg" alt="Filled Heart" onClick={handleRemoveFromFavorites} />
                     <span style={{marginTop:"2%"}}> Your Favourite</span>
                </>
              
              ) : (
                <>
                  
                <img style={{ width:"30px" ,height:"30px"}} className="add-to-favorites-img" src="/unfilled-heart.jpg" alt="Empty Heart" onClick={handleAddToFavorites} />
                <span style={{marginTop:"2%"}}>Add to Favorites</span>
                </>
               
              )}
            
            </div>

           
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


          <div className="Rating-class">
          <RecipeRating
            recipeId={recipe._id}
            initialRating={0}
            onSaveRating={handleSaveRating}
          />
          <label
            className="ViewRatingsButton"
            onClick={() => setIsRatingsVisible(!isRatingsVisible)}
          >
            View Ratings
          </label>
              {isRatingsVisible && (
                <div className="Rating-class2">
                  {ratings.map((rating, index) => (
                    <div key={index}>
                      <p>{rating.user_id === currentUserId ? 'You' : rating.user}</p>
                      <div>
                        {[...Array(rating.ratingNumber)].map((_, starIndex) => (
                          <img
                            key={starIndex}
                            src="/filled-star-image.svg"
                            alt="Filled Star"
                            style={{ width: '20px' }}
                          />
                        ))}
                        {[...Array(5 - rating.ratingNumber)].map((_, starIndex) => (
                          <img
                            key={starIndex}
                            src="/unfilled-star-image.svg"
                            alt="Unfilled Star"
                            style={{ width: '20px' }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="comment-class comment">
              <Comments comments={comments}  currentUser={currentUserId}/>
              <div className="enter-comment" style={{display:"flex", Gap:"100px"}}>
                <input  className="enter-comment-input"
                  ref={commentInputRef}
                  placeholder="Type your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <button
                  onClick={handleCommentSubmit}
                  style={{
                    borderRadius: '8px',
                    padding: '10px 15px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    background: '#F17228',
                    color: 'white',
                    border: 'none',
                    height: '35px',
                    width:'90px',
                    transition: 'background 0.3s ease-in-out',
                  }}
                >
                  Post
                </button>
              </div>
            </div>

            <div className="comment-class comment">
            <Reviews reviews={reviews}  currentUser={currentUserId}/>
              <div className="enter-comment" style={{display:"flex", Gap:"100px"}}>
                <input  className="enter-comment-input"
                  ref={reviewInputRef}
                  placeholder="Type your Review here..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />

                <button
                  onClick={handleReviewSubmit}
                  style={{
                    borderRadius: '8px',
                    padding: '10px 15px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    background: '#F17228',
                    color: 'white',
                    border: 'none',
                    height: '35px',
                    width:'90px',
                    transition: 'background 0.3s ease-in-out',
                  }}
                >
                  Post
                </button>
              </div>
            </div>
        
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