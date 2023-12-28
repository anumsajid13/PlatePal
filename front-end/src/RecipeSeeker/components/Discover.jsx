// Discover.js
import RecipeCard from './RecipieCard';
import Navbar from './Navbar'; 
import './Discover.css';
import { React, useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore.js';
import { jwtDecode } from 'jwt-decode';

const Discover = () => {
  const [recipes, setRecipes] = useState([]);
  const [followingChefIds, setFollowingChefIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = useTokenStore.getState().token;
  const [searchType, setSearchType] = useState("searchRecipesByName");
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); 


  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(parseInt(prevPage) - 1, 1));
  };
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const toggleFollowChef = async (chefId) => {
    try {
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

      console.log("currentPage",currentPage) 
      const url = `http://localhost:9000/recepieSeeker/allRecipes?page=${currentPage}&pageSize=${pageSize}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      const followingResponse = await fetch('http://localhost:9000/recepieSeeker/followings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (followingResponse.ok) {
        const followingData = await followingResponse.json();

        if (Array.isArray(followingData.followings)) {
          setFollowingChefIds(followingData.followings.map(chef => chef._id));
        } else {
          console.error('Invalid following chefs data format');
          setFollowingChefIds([]);
        }
      } else {
        console.error('Failed to fetch following chefs:', followingResponse.status, followingResponse.statusText);
      }

      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => parseInt(prevPage) + 1);
   
  };

 
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:9000/recepieSeeker/uniqueCategories');
      const data = await response.json();
      setCategories(data.uniqueCategories || []);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const fetchRecipes_Search = async (searchTerm, searchType) => {
    try {
      let url = `http://localhost:9000/recepieSeeker/${searchType}/${searchTerm}`;

      const response = await fetch(url);
      const data = await response.json();

      const followingResponse = await fetch('http://localhost:9000/recepieSeeker/followings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (followingResponse.ok) {
        const followingData = await followingResponse.json();

        if (Array.isArray(followingData.followings)) {
          setFollowingChefIds(followingData.followings.map(chef => chef._id));
        } else {
          console.error('Invalid following chefs data format');
          setFollowingChefIds([]);
        }
      } else {
        console.error('Failed to fetch following chefs:', followingResponse.status, followingResponse.statusText);
      }

      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  const fetchRecipes_Category = async (clickedCategory) => {
    try {
      let url = `http://localhost:9000/recepieSeeker//searchByCategory/${clickedCategory}`;

      const response = await fetch(url);
      const data = await response.json();

      const followingResponse = await fetch('http://localhost:9000/recepieSeeker/followings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (followingResponse.ok) {
        const followingData = await followingResponse.json();

        if (Array.isArray(followingData.followings)) {
          setFollowingChefIds(followingData.followings.map(chef => chef._id));
        } else {
          console.error('Invalid following chefs data format');
          setFollowingChefIds([]);
        }
      } else {
        console.error('Failed to fetch following chefs:', followingResponse.status, followingResponse.statusText);
      }

      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchTerm);
    fetchRecipes_Search(searchTerm, searchType);
  };

  const handleCategoryChange=(clickedCategory)=>{
    fetchRecipes_Category(clickedCategory)
  }

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, [token, currentPage, pageSize]);

  return (
    <>
      <div className='home'>
        <Navbar activeLink="Discover" />

        <div className="discover-container-1">
          <div className="search-card-11">
            <input
              className='searchRecepie'
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="search-dropdown-1" onChange={handleSearchTypeChange}>
              <option value="searchRecipesByName">Search by Recipe Name</option>
              <option value="searchRecipesByChef">Search by Chef</option>
            </select>
            <span onClick={handleSearch} style={{ cursor: "pointer" }} className="material-icons google-icon">search</span>
          </div>
          <div className="category-slider-container">
            <div className="category-slider">
              {categories.map((category) => (
                <div key={category} className="category-card" onClick={() => handleCategoryChange(category)}>
                  {category.replace(/"/g, '')}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div  className="Categories-choose">
          <p>Indulge in Culinary Delights</p>
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

      <div className="pagination-buttons">
          <button className="pagination-buttons-button" onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous Page
          </button>
          <span className="pagination-buttons-span">Page {currentPage}</span>
          <button className="pagination-buttons-button" onClick={handleNextPage}>Next Page</button>
        </div>
    </>
  );
};

export default Discover;
