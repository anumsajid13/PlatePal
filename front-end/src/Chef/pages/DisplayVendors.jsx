import  {React, useEffect, useState } from 'react';
import ChefNav from '../components/NavBarChef';
import './displayVendors.css';
import ReportPopUp from '../components/ReportPopup';
import { useParams } from 'react-router-dom';
import useTokenStore from '../../tokenStore';
import ChefGenericPopup from '../components/ChefGenericPopup';
import VendorPopup from './VendorPopup';
import { BASE_URL } from '../../url';

const DisplayVendors = () => {

    //const { token, setToken } = useTokenStore(); 
    const token = localStorage.getItem('token');
    const { id: recipeId } = useParams();

    const [vendorsWithIngredients, setVendorsWithIngredients] = useState([]);
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [selectedVendorId, setSelectedVendorId] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null); 


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${BASE_URL}/vendors_chef/vendors-with-ingredients`);
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
          const response = await fetch(`${BASE_URL}/chefVendors/sendCollabRequest/${recipeId}/${vendorId}`, {
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
                            <h2 onClick={() => setSelectedVendor(item)}  style={{ cursor: 'pointer' }} >{item.name}</h2>
                            
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

                {selectedVendor && <VendorPopup vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />}
        </>
    
    );

};


export default DisplayVendors;