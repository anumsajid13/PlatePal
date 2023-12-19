// RecipeCard.jsx
import RecipeRating from './RecipeRating.jsx';
import { useState, useRef,useEffect } from 'react';
import './RecipeCard.css';
import  useTokenStore  from  '../../tokenStore.js'
import Comments from './Comments';
import './Comments.css'
import { jwtDecode } from 'jwt-decode';


const RecipeCard = ({ recipe }) => {

  const token = useTokenStore.getState().token;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(null);
  const decodedToken = jwtDecode(token); 
  const currentUserId = decodedToken.id;
  const [isRatingsVisible, setIsRatingsVisible] = useState(false);

  console.log('Recipe Image Data:', recipe.recipeImage.data);

  console.log('Current decoded token:', decodedToken);
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
        setComments([...comments, { commentText, user: 'You', time: new Date() }]);
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

  const getImageSrc = () => {
    if (recipe.recipeImage && recipe.recipeImage.data) {
      const arrayBufferView = new Uint8Array(recipe.recipeImage.data);
      const blob = new Blob([arrayBufferView], { type: recipe.recipeImage.contentType });
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    }
    // Default image source or placeholder if no image is available
    return '/pasta.jpg';
  };

  return (
    <>
       
      <div className="outer-recipe">
        <div className="recipe-card">
          <>
          <div className="pagal-image">
            <img src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}></img>
          </div>
            
          
            {/* <img src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  className="recipe-image-chef" />*/}
          </>
          <div className="flexxx">
            <h3 onClick={handleCardClick}>{recipe.title} by Chef {recipe.chef.name}</h3>
            <p className='desc-para'>{truncateText(recipe.description, 20 )}</p>
          </div>
        </div>
      </div>
      <div className={`recipe-popup ${isPopupOpen ? 'popup-open' : ''}`}>
        <span className="material-icons google-icon close-btn" onClick={handleClosePopup} style={{cursor:"pointer"}}>close</span>

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
            <p className='recepie-category' style={{color:"purple"}}>Chef: {recipe.chef.name}</p>
            <p className='recepie-category' style={{color:"purple"}}>Serving size: {recipe.servingSize}</p>
            <p className='recepie-category' style={{color:"purple"}}>Calories: {recipe.calories}</p>
            <p className='recepie-category' style={{color:"purple"}}>Total Time: {recipe.totalTime}</p>
            <ul className='recepie-category'>
                {recipe.category.map((cat, index) => (
                <li key={index}>{cat}</li>
                ))}
            </ul>
            <p>{recipe.description}</p>
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

        
      </div>
            <div className="comment-class comment">
            <Comments comments={comments}  currentUser={currentUserId}/>
            <div className="enter-comment" style={{display:"flex", rowGap:"100px"}}>
              <input
                ref={commentInputRef}
                placeholder="Type your comment here..."
                style={{
                  borderRadius: '10px', 
                  height: '40px',
                  paddingLeft: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                  width: '60%', 
                }}
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
                background: 'rgb(218, 94, 218)',
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
        </div>

    </>
  );
};

export default RecipeCard;
