import React from 'react';
import '../../RecipeSeeker/components/RecipeCard.css';
import { useState} from 'react';

const VendorReviews = ({ reviews, currentUser }) => {
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
              <div>
                <p style={{ display: 'block', marginRight: '10px', marginLeft: '10px' }}>
                    {review.user._id === currentUser ? 'You' : review.user.name}:
                </p>
                <p style={{ display: 'block', marginLeft: '10px' }}>{review.reviewText}</p>
               </div>
              </div>
              <p style={{ display: 'block', marginLeft: '10px' }}>{new Date(review.time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VendorReviews;
