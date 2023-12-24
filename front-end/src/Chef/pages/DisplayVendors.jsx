import  {React, useEffect, useState } from 'react';
import ChefNav from '../components/NavBarChef';
import './displayVendors.css';
import ReportPopUp from '../components/ReportPopup';

const DisplayVendors = () => {

    const [vendorsWithIngredients, setVendorsWithIngredients] = useState([]);
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [selectedVendorId, setSelectedVendorId] = useState('');

    useEffect(() => {
        fetch('http://localhost:9000/vendors_chef/vendors-with-ingredients')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
                setVendorsWithIngredients(data || []); 
            })
            .catch(error => console.error('Error fetching vendors with ingredients:', error));
    }, []);

    const handleReportClick = (vendorId) => {
        console.log('gee')
        setSelectedVendorId(vendorId);
        setShowReportPopup(true);
    };
    

    const handleButtonClick = () => {
        
    };

    return (

        <>
            <ChefNav/>
                <div className="vendors-list">
                    <h1>List of Vendors</h1>
                        {vendorsWithIngredients.map(item => (
                        <div key={item.vendor._id} className="vendor-item">
                            <h2>{item.vendor.name}</h2>
                            <p>Email: {item.vendor.email}</p>
                            <h3>Ingredients:</h3>
                            <ul>
                                {item.ingredients.map(ingredient => (
                                    <li key={ingredient._id}>
                                        {ingredient.name} - {ingredient.description}
                                    </li>
                                ))}
                            </ul>
                            <button className='vendor-chef-displayVendors' onClick={() => handleButtonClick()}>Collaborate</button>
                            <button className='vendor-chef-displayVendors' onClick={() => handleReportClick(item.vendor._id)}>Report</button>

                        </div>
                    ))}
                </div>

                {showReportPopup && (
                    <ReportPopUp vendorId={selectedVendorId} />
                )}
        </>
    
    );

};


export default DisplayVendors;