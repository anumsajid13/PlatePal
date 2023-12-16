// RecipeSeekerSignUp.jsx
import React, { useState } from 'react';
import './RecipeSeekerSignUp.css'; 
import useNavbarStore from '../../navbarStore';
import { Link } from 'react-router-dom';

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
    
          const response = await fetch('http://localhost:9000/recepieSeeker/recipeSeeker_signup', {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            const data = await response.json();
            console.error('Sign Up failed:', data.message);
            // Handle the error (e.g., show an error message to the user)
            return;
          }
    
          const data = await response.json();
          console.log('Sign Up successful:', data.message);
          // Optionally, you can redirect the user to another page, show a success message, etc.
    
        } catch (error) {
          console.error('Error during Sign Up:', error.message);
          // Handle the error (e.g., show an error message to the user)
        } finally {
          setLoading(false);
        }
      };
    

  return (

    <>
    <nav className="navbar" style={{ height: '45px' }}>
        <div className="logo">Plate Pal</div>
        <div className="nav-links">
        <Link to="/"  style={{ color: 'black', textDecoration: 'none' }} onClick={() => setActiveLink('Home')} className={activeLink === 'Home' ? 'active-link' : ''}>
          Home
          </Link>
          <div onClick={() => setActiveLink('Contact Us')} className={activeLink === 'Contact Us' ? 'active-link' : ''}>
            Contact Us
          </div>
          <div onClick={() => setActiveLink('About Us')} className={activeLink === 'About Us' ? 'active-link' : ''}>
            About Us
          </div>
          <div className="icon-link dropdown" title="Profile" onClick={toggleDropdown}>
            <span className="material-icons google-icon">person</span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/signup" className="link">
                  Sign Up
                </Link>
                <Link to="/signin" className="link">
                  Sign In
                </Link>
              </div>
            )}
          </div>
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
        <button type="button" onClick={handleSignUp} disabled={loading} className="form-button">
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
