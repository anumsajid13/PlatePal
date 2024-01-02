import React, { useState, useEffect } from 'react';
import './chefReviewss.css';
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore';
import { BASE_URL } from '../../url';

const ChefViewReviews = () => {
    const [reviews, setReviews] = useState([]);
    //const { token } = useTokenStore(); 

    const token = localStorage.getItem('token');

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${BASE_URL}/chef/chefReviews`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }

            const data = await response.json();
            console.log(data)
            setReviews(data.chefReviews);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        fetchReviews();
    }, [token]); 

    //function to toggle pinning/unpinning a review
const togglePinReview = async (reviewId, isPinned) => {
    try {
        const response = await fetch(`${BASE_URL}/chef/${isPinned ? 'unpinReview' : 'pinReview'}/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to ${isPinned ? 'unpin' : 'pin'} review`);
        }

        //update the reviews after toggling pinning
        const updatedReviews = reviews.map((review) =>
            review._id === reviewId ? { ...review, isPinned: !isPinned } : review
        );
        setReviews(updatedReviews);

        //fetch reviews again after pinning/unpinning
        fetchReviews();
    } catch (error) {
        console.error(`Error ${isPinned ? 'unpinning' : 'pinning'} review:`, error);
    }
};


    return (
        <>
        <ChefNav />
        <div className="review-container">
          <h2 className='chef-review-heading'>Chef's Reviews</h2>
          {reviews.length === 0 ? (
            <div className='no-reviewsss'>
            <p>No reviews available</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review-item">
                {/* Displaying review information */}
                <h3 className='chef-review-subheading'>{review.recipe.title}</h3>
                <p className='chef-review-text'>User: {review.user.name}</p>
                <p className='chef-review-text'>Review: {review.Review}</p>
                <p className='chef-review-text'>Time: {new Date(review.Time).toLocaleString()}</p>
                <div className="button-container">
                  {/* Button to toggle pinning/unpinning reviews */}
                  <button onClick={() => togglePinReview(review._id, review.isPinned)} className="pin-button">
                    {review.isPinned ? 'Unpin Review' : 'Pin Review'}
                  </button>
                  {review.isPinned && 
                  <span className="material-icons google-icon" >
                    push_pin
                  </span>}
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );

};

export default ChefViewReviews;