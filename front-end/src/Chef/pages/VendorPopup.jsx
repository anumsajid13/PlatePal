import React from 'react';
import './vendorPopup.css';

const VendorPopup = ({ vendor, onClose }) => {
    return (
        <div className="vendor-popup-overlay">
          <div className="vendor-popup">
            {/* Content of the vendor popup */}
            <h2>{vendor.name}</h2>
            <p>Email: {vendor.email}</p>
            <h3>Ingredients:</h3>
            <div className='ingredientsss-and-imagess'>
                                {vendor.ingredients.map(ingredient => (
                                    <ul key={ingredient._id} >
                                            {ingredient.productImage && typeof ingredient.productImage === 'string' ? (
                                                <div style={{display:"flex", gap:"10px", flexDirection:'row'}}>
                                                <img
                                                src={ingredient.productImage}
                                                style={{ width: '70px', height: '70px', borderRadius: '70px', objectFit:'cover', justifyContent: 'center', alignItems: 'center' }}
                                                />
                                               
                                                </div>
                                            
                                            ) : (
                                                <div style={{display:"flex", gap:"10px", flexDirection:'row'}}>
                                                <img
                                                src={ingredient.productImage.data ? `data:image/jpeg;base64,${ingredient.productImage.data}` : require('../assets/images/no-profile-picture-15257.svg').default} 
                                               
                                                style={{ width: '70px', height: '70px', borderRadius: '70px' , objectFit:'cover',  justifyContent: 'center', alignItems: 'center' }}
                                                />
                                                </div>
                                            
                                            )}
                                        {ingredient.name} 
                                    </ul>
                                ))}
                            </div>
            {/* Add buttons for reporting, collaborating, etc. */}
            <div className="vendor-popup-buttons">
              <button onClick={onClose}>Close</button>
              {/* Other buttons or actions */}
            </div>
          </div>
        </div>
      );
}

export default VendorPopup;
