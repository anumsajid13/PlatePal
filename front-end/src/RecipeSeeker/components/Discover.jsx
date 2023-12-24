// Discover.js
import RecipeCard from './RecipieCard';
import Navbar from './Navbar'; 
import './Discover.css';
import  {React, useEffect, useState } from 'react';
import  useTokenStore  from  '../../tokenStore.js';
import { jwtDecode } from 'jwt-decode';


const Discover = () => {
  const [recipes, setRecipes] = useState([]);
  const [followingChefIds, setFollowingChefIds] = useState([]);
  const token = useTokenStore.getState().token;

  const toggleFollowChef = async (chefId) => {
    try {
      console.log("Before Toggle - Following Chef IDs:", followingChefIds);
       console.log("IS chef id available inside the array: ",followingChefIds.includes(chefId))

      const response = await fetch(`http://localhost:9000/recepieSeeker/${followingChefIds.includes(chefId) ? 'unfollowChef' : 'followChef'}/${chefId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setFollowingChefIds((prevFollowingChefIds) =>
          prevFollowingChefIds.includes(chefId)
            ? prevFollowingChefIds.filter((id) => id !== chefId)
            : [...prevFollowingChefIds, chefId]
        );
  
       
      } else {
        console.error('Failed to follow/unfollow chef:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error following/unfollowing chef:', error.message);
    }
  };
  
  
  

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:9000/recepieSeeker/allRecipes?page=$1&pageSize=$3', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();

      
      const followingResponse = await fetch('http://localhost:9000/recepieSeeker/followings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (followingResponse.ok) {
        const followingData = await followingResponse.json();
        console.log("following chef: ",followingData)
        
          if (Array.isArray(followingData.followings)) {
            // Assuming followings is an array of objects with _id property
            setFollowingChefIds(followingData.followings.map(chef => chef._id));
          } else {
            console.error('Invalid following chefs data format');
            setFollowingChefIds([]); // Set to an empty array or handle it according to your needs
          }
        
      } else {
        console.error('Failed to fetch following chefs:', followingResponse.status, followingResponse.statusText);
      }

     
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  useEffect(() => {

    fetchRecipes();
    console.log("After Toggle - Following Chef IDs:", followingChefIds);
  }, [token]);
  return (
    <>
       <Navbar activeLink="Discover" />
      <div className='home'>
      <div className="discover-container-1">
        <div className="search-card-11">
          <input className='searchRecepie' type="text" placeholder="Search..." />
          <select className="search-dropdown-1">
            <option value="recipeName">Search by Recipe Name</option>
            <option value="chef">Search by Chef</option>
          </select>
          <span className="material-icons google-icon">search</span>
          
        </div>
        <div className="category-card-11">
          <label>Category 1</label>
          <label>Category 2</label>
          <label>Category 3</label>
          <label>Category 4</label>
          <label>Category 5</label>
        </div>
      </div>
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe._id}>
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                isFollowingChef={recipe.chef && followingChefIds && followingChefIds.includes(recipe.chef._id)}
                onToggleFollow={() => recipe && recipe.chef && toggleFollowChef(recipe.chef._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Discover;