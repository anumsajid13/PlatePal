import  {React, useEffect, useState } from 'react';
import ChefNav from '../components/NavBarChef';
import './displayVendors.css';

const DisplayVendors = () => {

    const [vendorsWithIngredients, setVendorsWithIngredients] = useState([]);

    useEffect(() => {
        fetch('http://localhost:9000/vendors_chef/vendors-with-ingredients')
          .then(response => response.json())
          .then(data => setVendorsWithIngredients(data))
          .catch(error => console.error('Error fetching vendors with ingredients:', error));
          console.log(vendorsWithIngredients.vendor)
    }, []);



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
                        </div>
                    ))}
                </div>
        </>
    
    );

};


export default DisplayVendors;