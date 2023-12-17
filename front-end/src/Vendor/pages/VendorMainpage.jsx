// Discover.js
import  Indiviual from './Ingredients';
//import Navbar from './Navbar'; 
import '../assets/styles/mainpage.css'; 
import  {React, useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';

import NavigationBar from '../components/NavigationBar';

const MainPage = () => {

    const [Ingredients, setIngredients] = useState([]);
    const { token } = useTokenStore();
  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const response = await fetch('http://localhost:9000/Ingredients/All?page=1&pageSize=30', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch Ingredients', response.message);
        }
        const data = await response.json();
        await setIngredients(data);
      } catch (error) {
        console.error('Error fetching Ingredients:', error.message);
      }
    };

    fetchAllIngredients();
  }, []);
  return (
    <>
  <NavigationBar />
    <div >
      <div className="container">
        <div className="search-card-1">
          <input className='searchRecepie' type="text" placeholder="Search..." />
          <select className="search-dropdown-1">
            <option value="recipeName">Search by Recipe Name</option>
            <option value="chef">Search by Chef</option>
          </select>
          <span className="search-icon-1">&#128269;</span>
          
        </div>
        </div>
      <div >
          {Ingredients.map((indiviual) => (
            console.log("in mainpage",indiviual),
            <Indiviual key={indiviual._id} ingredients={indiviual} />
          ))}
        </div>
        </div>
        
    </>
  );
};

export default MainPage;
