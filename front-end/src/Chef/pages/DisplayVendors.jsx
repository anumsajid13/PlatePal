import  {React, useEffect, useState } from 'react';
import ChefNav from '../components/NavBarChef';
import './displayVendors.css';
import ReportPopUp from '../components/ReportPopup';
import { useParams } from 'react-router-dom';
import useTokenStore from '../../tokenStore';
import ChefGenericPopup from '../components/ChefGenericPopup';

const DisplayVendors = () => {

    const { token, setToken } = useTokenStore(); 

    const { id: recipeId } = useParams();

    const [vendorsWithIngredients, setVendorsWithIngredients] = useState([]);
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [selectedVendorId, setSelectedVendorId] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:9000/vendors_chef/vendors-with-ingredients');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setVendorsWithIngredients(data);
          } catch (error) {
           
            console.error('Error fetching vendors with ingredients:', error);
          }
        };
    
        fetchData();
      }, []);

    const handleReportClick = (vendorId) => {
        console.log('gee')
        setSelectedVendorId(vendorId);
        setShowReportPopup(true);
    };

    const handleCloseReportPopup = () => {
        setShowReportPopup(false); 
      };
    

      const handleButtonClick = async ( vendorId) => {
        try {
          const response = await fetch(`http://localhost:9000/chefVendors/sendCollabRequest/${recipeId}/${vendorId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, 
            },
          });
      
          if (!response.ok) {
            throw new Error('Error sending collaboration request');
          }
      
          const responseData = await response.json();
          console.log(responseData); 
          setResponseMessage(responseData.message);
            setShowPopup(true);
        } catch (error) {
          console.error('Error sending collaboration request:', error);
          
        }
      };

      const handleClosePopup = () => {
        setShowPopup(false);
        setResponseMessage('');
      };

    return (

        <>
            <ChefNav/>
                <div className="vendors-list">
                    <h1>List of Vendors</h1>
                        {vendorsWithIngredients.map(item => (
                        <div key={item._id} className="vendor-item">
                             {item.profilePicture && typeof item.profilePicture === 'string' ? (
                        <div style={{display:"flex", gap:"10px", flexDirection:'row'}}>
                        <img
                          src={item.profilePicture}
                          style={{ width: '70px', height: '70px', borderRadius: '70px', objectFit:'cover' }}
                        />
                          
                        </div>
                      
                      ) : (
                        <div style={{display:"flex", gap:"10px", flexDirection:'row'}}>
                        <img
                          src={item.profilePicture.data ? `data:image/jpeg;base64,${item.profilePicture.data}` : require('../assets/images/no-profile-picture-15257.svg').default} 
                          alt={`Chef ${item.name}`}
                          style={{ width: '70px', height: '70px', borderRadius: '70px' , objectFit:'cover'}}
                        />
                          
                        </div>
                      
                      )}
                            <h2>{item.name}</h2>
                            <p>Email: {item.email}</p>
                            <h3>Ingredients:</h3>
                            <div className='ingredientsss-and-imagess'>
                                {item.ingredients.map(ingredient => (
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
                            {recipeId !== '1' && (
                                
                                <button
                                    className="vendor-chef-displayVendors"
                                   
                                    onClick={() => handleButtonClick(item._id)}
                                >
                                    Collaborate
                                </button>
                            )}
                            <button className='vendor-chef-displayVendors' onClick={() => handleReportClick(item._id)}>Report</button>

                        </div>
                    ))}
                </div>

                {showReportPopup && (
                    <ReportPopUp vendorId={selectedVendorId} onClose={handleCloseReportPopup}/>
                )}

                {showPopup && <ChefGenericPopup message={responseMessage} onClose={handleClosePopup} />}
        </>
    
    );

};


export default DisplayVendors;