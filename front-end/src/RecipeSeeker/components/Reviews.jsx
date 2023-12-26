// Reviews.jsx
import React from 'react';
import './RecipeCard.css';
import { useState, useRef } from 'react';

const Reviews = ({ reviews, currentUser }) => {
  const [reviewVisible, setReviewVisible] = useState(false);

  const toggleReviewVisibility = () => {
    setReviewVisible(!reviewVisible);
  };


  return (
    <>
      <div className="comment-class comments-section">
        <h3 onClick={toggleReviewVisibility}>Reviews</h3>
        <div className={`comments-list ${reviewVisible ? 'visible' : ''}`}>
          {reviews.map((review, index) => (
            <div key={index} className="comment">
              {review.user.profilePicture && typeof review.user.profilePicture === 'string' ? (
                <img
                  src={review.user.profilePicture}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius:"20px" }}
                />
              ) : (
                
                <img
                  src=""
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius:"20px" }}
                />
                 
               
              )}
              <div className='profilepic-div' style={{display:"flex", flexDirection:"row"}}>
              <p style={{}}>{review.user._id === currentUser ? 'You' : review.user.name}</p>
              <p style={{marginLeft:"10px"}}>{review.reviewText}</p>
              </div>
              <p>{new Date(review.time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Reviews;
