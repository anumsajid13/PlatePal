import React from 'react';
import './vendorPopup.css';

const VendorPopup = ({ vendor, onClose }) => {
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
                                            style={{ width: '70px', height: '70px', borderRadius: '70px', objectFit: 'cover', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", gap: "10px", flexDirection: 'row' }}>
                                        <img
                                            src={ingredient.productImage?.data ? `data:image/jpeg;base64,${ingredient.productImage.data}` : require('../assets/images/no-profile-picture-15257.svg').default}
                                            style={{ width: '70px', height: '70px', borderRadius: '70px', objectFit: 'cover', justifyContent: 'center', alignItems: 'center' ,  margin: 'auto'}}
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
            </div>
        </div>
    );
}

export default VendorPopup;
