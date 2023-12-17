// RecipeCard.jsx
import RecipeRating from './RecipeRating.jsx';
import { useState, useRef } from 'react';
import './RecipeCard.css';
import  useTokenStore  from  '../../tokenStore.js'
import Comments from './Comments';

const RecipeCard = ({ recipe }) => {

  const token = useTokenStore.getState().token;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(null);


  console.log('Current token:', token);
  console.log("recipe id: ",recipe._id )
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

      if (ratingResponse.ok && commentResponse.ok) {
        const ratingData = await ratingResponse.json();
        const commentData = await commentResponse.json();

        
        setRatings(ratingData.ratings);
        setComments(commentData.comments);
        console.log("Comments: ", commentData.comments)
        setIsPopupOpen(true);
      } else {
        console.error(
          'Failed to fetch ratings or comments:',
          ratingResponse.status,
          ratingResponse.statusText,
          commentResponse.status,
          commentResponse.statusText
        );
      }
    } catch (error) {
      console.error('Error fetching ratings or comments:', error.message);
    }
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
        body: JSON.stringify({ commentText }),
      });

      if (response.ok) {
        console.log('Comment added successfully');
        // Update local state with the new comment
        setComments([...comments, { commentText, user: 'current_user', time: new Date() }]);
        setCommentText('');
      } else {
        console.error('Failed to add comment:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
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
        // Updating local state with the new rating
        setRatings([...ratings, { ratingNumber: selectedRating, user: 'current_user' }]);
       
      } else {
        console.error('Failed to save rating:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving rating:', error.message);
    }
  };

  return (
    <>
       
      <div className="outer-recipe">
        <div className="recipe-card">
          <>
            <img src="/pasta.jpg" alt="image here" style={{ width: '300px', height: '180px' }}></img>
          </>
          <div className="flexxx">
            <h3 onClick={handleCardClick}>{recipe.title} by Chef {recipe.chef.name}</h3>
            <p>{recipe.description}</p>
          </div>
        </div>
      </div>
      <div className={`recipe-popup ${isPopupOpen ? 'popup-open' : ''}`}>
        <span className="close-btn" onClick={handleClosePopup}>
          &times;
        </span>

        <div className="recipe-details">
            <div className="recipe-details-left">
            <img src="/pasta.jpg" alt="image here" />
            <p>Ingredients:</p>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                    {ingredient.name}: {ingredient.quantity}
                </li>
                ))}
            </ul>
            <p>Allergens:</p>
            <ul>
                {recipe.allergens.map((all, index) => (
                <li key={index}>
                    {all}
                </li>
                ))}
            </ul>
            <p>Required Utensils:</p>
            <ul>
                {recipe.utensils.map((uten, index) => (
                <li key={index}>
                    {uten}
                </li>
                ))}
            </ul>

            <p>Instructions:</p>
            <ul>
                {recipe.instructions.map((instruct, index) => (
                <li key={index}>
                    {instruct}
                </li>
                ))}
            </ul>
            
            </div>
            <div className="recipe-details-right">
            <h3 >{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p className='recepie-category'>Chef: {recipe.chef.name}</p>
            <p className='recepie-category'>Serving size: {recipe.servingSize}</p>
            <p className='recepie-category'>Calories: {recipe.calories}</p>
            <p className='recepie-category'>Total Time: {recipe.totalTime}</p>
            <ul className='recepie-category'>
                {recipe.category.map((cat, index) => (
                <li key={index}>{cat}</li>
                ))}
            </ul>
            <div className="Rating-class">
                <RecipeRating
            recipeId={recipe._id}
            initialRating={0}
            onSaveRating={handleSaveRating}
            />
            {ratings.map((rating, index) => (
            <div  className="Rating-class2" key={index}>
                <p>Rated by {rating.user}:</p>
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
            <div className="comment-class">
            <textarea
                  ref={commentInputRef}
                  rows="4"
                  cols="50"
                  placeholder="Type your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
            <button onClick={handleCommentSubmit}>Post Comment</button>
            <Comments comments={comments} />
            </div>

        </div>
        </div>
        </div>

    </>
  );
};

export default RecipeCard;
