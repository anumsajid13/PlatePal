// RecipeSeekerSignUp.jsx
import React, { useState } from 'react';
import './RecipeSeekerSignUp.css'; 
import useNavbarStore from '../../navbarStore';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../url';

const RecipeSeekerSignUp = () => {

  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        
        try {
          const formData = new FormData();
          
          formData.append('name', name);
          formData.append('username', username);
          formData.append('email', email);
          formData.append('password', password);
          formData.append('profilePicture', profilePicture);
    
          const response = await fetch(`${BASE_URL}/recepieSeeker/recipeSeeker_signup`, {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            const data = await response.json();
            console.error('Sign Up failed:', data.message);
            alert("Sign up failed")
            return;
          }
    
          const data = await response.json();
          console.log('Sign Up successful:', data.message);
          
    
        } catch (error) {
          console.error('Error during Sign Up:', error.message);
         
        } finally {
          setLoading(false);
        }
      };
    

  return (
    <>
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
          <div  className={activeLink === 'Contact Us' ? 'active-link' : ''}
           style={{
           
            textDecoration: 'none', 
            cursor: 'pointer', 
          }}
          >Contact Us</div>
          <div  className={activeLink === 'About Us' ? 'active-link' : ''}
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
     
      <div className="recipe-seeker-signup-container">
      <div className='for-flex'>
      <form className="card-container1">
      <h2 className='l1'>Recipe Seeker Sign Up</h2>
        <label className="form-label ">
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
        </label>
        <label className="form-label">
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" />
        </label>
        <label className="form-label">
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
        </label>
        <label className="form-label">
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
        </label>
        <label className="form-label">
          Profile Picture:
          <input className='Profile-Picture' type="file" onChange={(e) => setProfilePicture(e.target.files[0])}  />
        </label>
        <button className="signup-button" type="button" onClick={handleSignUp} disabled={loading} >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        
      </form>
      <div className='image-side'>
             
      </div>
      </div>
      
    </div>
    </>
  );
};

export default RecipeSeekerSignUp;
