import { useState, useRef,useEffect } from 'react';
import './vendorPopup.css';
import ChefReviews from '../components/VendorReviews';
import { jwtDecode } from 'jwt-decode';


const VendorPopup = ({ vendor, onClose }) => {

    const [newReviewText, setNewReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token); 
    const currentUserId = decodedToken.id;

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:9000/chef/reviews/${vendor._id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,       
                },
            }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            console.log('reviews', data)
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [vendor._id]);

    const handleReviewSubmit = async () => {
        try {
            const response = await fetch('http://localhost:9000/chef/writeReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vendorId: vendor._id,
                    reviewText: newReviewText,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            //if the review is submitted successfully, update the reviews displayed
            const data = await response.json();
            console.log('Review submitted:', data);
            setNewReviewText(''); // Clear the input field after submission

            //fetch updated reviews after submitting a new review
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div className="vendor-popup-overlay">
            <div className="vendor-popup">
                <button className="vendor-chef-pop-close-btn" onClick={onClose}>
                    <span className="material-icons">close</span>
                </button>

                <h2>{vendor.name}</h2>
                <p>Email: {vendor.email}</p>
                <h3>Ingredients:</h3>
                <div className='ingredientsss-and-imagess'>
                    {vendor.ingredients.length > 0 ? (
                        vendor.ingredients.map(ingredient => (
                            <ul className='innner-ficc' key={ingredient._id}>
                                {ingredient.productImage && typeof ingredient.productImage === 'string' ? (
                                    <div style={{ display: "flex", gap: "10px", flexDirection: 'row' }}>
                                        <img
                                            src={ingredient.productImage}
                                            style={{ width: '100px', height: '100px', borderRadius: '70px', objectFit: 'cover', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", gap: "10px", flexDirection: 'row' }}>
                                        <img
                                            src={ingredient.productImage?.data ? `data:image/jpeg;base64,${ingredient.productImage.data}` : require('../assets/images/no-profile-picture-15257.svg').default}
                                            style={{ width: '100px', height: '100px', borderRadius: '70px', objectFit: 'cover', justifyContent: 'center', alignItems: 'center' ,  margin: 'auto'}}
                                        />
                                    </div>
                                )}
                                <p>{ingredient.name}</p>
                                <p>Rs. {ingredient.price}</p>
                              
                            </ul>
                        ))
                    ) : (
                        <p>No ingredients</p>
                    )}   
                </div>
                
                <div className='vendor-popup-reviews'>
                    <ChefReviews reviews={reviews}  currentUser={currentUserId}/>
                    <div className="enter-comment" style={{display:"flex", Gap:"100px"}}>
                <input  className="enter-comment-input"
                 
                  placeholder="Type your Review here..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
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
    );
}

export default VendorPopup;
