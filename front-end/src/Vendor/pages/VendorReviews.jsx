import React, { useState, useEffect } from 'react';
import '../../Chef/pages/chefReviewss.css';
import NavigationBar from '../components/NavigationBar';
import useTokenStore from '../../tokenStore';

const VendorViewReviews = () => {
    const [reviews, setReviews] = useState([]);
    const { token } = useTokenStore();

    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:9000/vendor/review', {
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
            console.log(data);
            setReviews(data.vendorReviews);  // Use 'vendorReviews' instead of 'chefReviews'
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [token]);

    // Function to toggle pinning/unpinning a review
    const togglePinReview = async (reviewId, isPinned) => {
        try {
            const response = await fetch(`http://localhost:9000/vendor/review/${isPinned ? 'unpinReview' : 'pinReview'}/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isPinned ? 'unpin' : 'pin'} review`);
            }

            // Update the reviews after toggling pinning
            const updatedReviews = reviews.map((review) =>
                review._id === reviewId ? { ...review, isPinned: !isPinned } : review
            );
            setReviews(updatedReviews);

            // Fetch reviews again after pinning/unpinning
            fetchReviews();
        } catch (error) {
            console.error(`Error ${isPinned ? 'unpinning' : 'pinning'} review:`, error);
        }
    };

    return (
        <>
            <NavigationBar />
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
                            <h3 className='chef-review-subheading'>Chef: {review.user.name}</h3>
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

export default VendorViewReviews;