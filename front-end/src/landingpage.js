//landngpage.js
import './landingpage.css';

import { Link } from 'react-router-dom';
import useNavbarStore from './navbarStore'; 
import RecipeCard from './New_recipecard';
import  {React, useEffect, useState } from 'react';

// Create the functional component for the landing page
const LandingPage = () => {

  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:9000/recepieSeeker/allRecipes?page=$1&pageSize=$3');
 
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();     
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  useEffect(() => {
    console.log("fetching...")
    fetchRecipes();
    
  }, []);

  const handleAboutClick = () => {
    const aboutSection = document.getElementById('about-us-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  

  const handleContact = () => {
    const contactSection = document.getElementById('contact-footer-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlediscover = () =>{
    const recipeSection = document.getElementById('lala');
    if (recipeSection) {
      recipeSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
 
  return (
    <div className='The-most-outer-part'>
      {/* White navigation bar */}
      <nav className="navbar-landingpage">
        {/* Plate Pal logo on the left */}
        <div className="logo">Plate Pal</div>

        {/* Search bar with search icon 
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-button-landing">
            <span className="material-icons google-icon">search</span>
          </button>
        </div>*/}

        {/* Clickable components on the right */}
        <div className="nav-links">
          <Link
            to="/"
            style={{ color: 'black', textDecoration: 'none', marginRight:'5%' }}
            onClick={() => setActiveLink('Home')}
            className={activeLink === 'Home' ? 'active-link' : ''}
          >
            Home
          </Link>
          <div  onClick={() => handleContact()} className={activeLink === 'Contact Us' ? 'active-link' : ''}
           style={{
           
            textDecoration: 'none', 
            cursor: 'pointer', 
          }}
          >Contact Us</div>
          <div onClick={() => handleAboutClick()} className={activeLink === 'About Us' ? 'active-link' : ''}
           style={{
            
            textDecoration: 'none', 
            cursor: 'pointer', 
          }}
          >About Us</div>
        
              <button  className="landing-signin-button" > <Link to="/signin" className='link'>Log In</Link></button>
              <button  className="landing-signup-button-2"><Link to="/signup" className='link'>Sign Up</Link></button>



            {/* Dropdown menu 
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/signup" className='link'>Sign Up</Link>
                <Link to="/signin" className='link'>Sign In</Link>
              </div>
            )}*/}
          
        </div>
      </nav>

      {/* Yellow background div with "Best Food" text and image */}
      <div className="best-food-container">
        <div className="best-food-text">
          <span className="inline-text"> </span>
          
          <span className="inline-text" style={{marginTop:"8%"}}>Are you starving?</span>

          <div className="additional-text">
            <p>Explore our delicious and nutritious food options made with the freshest ingredients.</p>
          </div>
          <button onClick={() => handlediscover()} className="discover-menu-button" style={{marginLeft:"3%"}}>Discover Menu</button>
        </div>

        {/* You can replace the placeholder with the actual image source */}
        <div className="image-landingpage">
         
        </div>
      </div>

    <div className="outer-container-landingpage">
      {/*<div className="category-container">
        <div className="category" >
          Salads
        </div>
        <div className="category" >
          Burgers
        </div>
        <div className="category" >
          Pasta
        </div>
        <div className="category" >
          Pizza
        </div>
          </div>*/}
       
       <div className="how-it-works">
          <p style={{marginLeft:'25%'}}>How Does It Work?</p>
        </div>

        <div className="how-it-works-steps">

          <div className="works-steps">
              <img src="./HowItWorks.PNG"></img>
          </div>
        </div>

      {/* Food information divs */}
      <div className="LALALALA" id='lala'>
      <div className="recipe-list" style={{marginLeft:"6%", gap:"2%"}}>
          {recipes.map((recipe) => (
            <div key={recipe._id}>
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
               
              />
            </div>
          ))}
        </div>
      <div className="landing-about-us-wrapper" id="about-us-section">
        <div className="landing-about-us" >
          <div className='about-us-image'>
            <img src='./AboutUs_Image_1.avif'/>
          </div>
          
          <h2 className="landing-about-us-heading" >Our Mission</h2>
          <p className="landing-about-us-text">At PlatePal, our mission is to inspire and empower everyone to cook delicious, chef-curated meals effortlessly. We strive to deliver premium-quality, farm-fresh ingredients along with easy-to-follow recipes, ensuring our customers enjoy cooking wholesome meals while fostering a deeper appreciation for food</p>
        </div>

        <div className="landing-about-us" >
          <h2 className="landing-about-us-heading" >About us</h2>
          <p className="landing-about-us-text">Founded in 2023, PlatePal was born out of a shared passion for culinary innovation and a commitment to making home cooking enjoyable and hassle-free. Our founders, Anum, Haniya, Amna and Aiyza, envisioned a service that would eliminate meal planning stress and encourage healthier eating habits.</p>
          <div className='about-us-image-2'>
            <img src='./pictureee.avif'/>
          </div>
        </div>
        </div>
        <footer className="contact-footer" id="contact-footer-section">
          <div className="contact-info">
            <h3>Contact Us</h3>
            <p>Email: platePal@example.com</p>
            <p>Phone: +92345-3245666</p>
          </div>
        </footer>

        
      </div>

      </div>
    </div>
  );
}


export default LandingPage;