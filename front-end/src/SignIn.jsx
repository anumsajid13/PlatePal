// SignInPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNavbarStore from './navbarStore';
import useTokenStore from './tokenStore';
import './SignIn.css';

const SignInPage =  () => {
    const navigate = useNavigate();
  const { setToken } = useTokenStore();
  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('recipeSeeker');

  const handleSignIn = async() => {
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('User Type:', userType);

    switch (userType) {
      case 'recipeSeeker':
        await signInRecipeSeeker();
        break;
      case 'admin':
        await signInAdmin();        
        break;
      case 'chef':
        // Redirect to Chef route
        break;
      case 'vendor':
        // Redirect to Vendor route
        break;
      case 'nutritionist':
        // Redirect to Nutritionist route
        break;
      default:
        // Handle invalid user type
    }
  };

  const signInRecipeSeeker = async () => {
    try {
        const response = await fetch('http://localhost:9000/recepieSeeker/recipeSeeker_signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (!response.ok) {
          const data = await response.json();
          console.error('Sign In failed:', data.message);
        
          return;
        }
  
        const data = await response.json();
        console.log('Sign In successful:', data.message);
        alert('Sign In successful')
        
        setToken(data.token);
        navigate('/recipe-seeker/Discover');
      } catch (error) {
        console.error('Error during Sign In:', error.message);
        alert('Could not sign in')
      }
  };

  const signInAdmin = async () => {
    try {
      const response = await fetch('http://localhost:9000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Admin Sign In failed:', data.error);
        alert('Admin Sign In failed');
        return;
      }

      const data = await response.json();
      console.log('Admin Sign In successful:', data.token);
      alert('Admin Sign In successful');
      // Store the admin token using the token store (if needed)
      setToken(data.token);
    } catch (error) {
      console.error('Error during Admin Sign In:', error.message);
      alert('Could not sign in as admin');
    }
  };

  return (
    <div>
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

      <div className="page-container">
        <div className="card-container">
          <div className="form-side">
            <h2 className="heading1">Sign In To Your Account</h2>
            <label>
              Username
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <label>
              User Type
              <br />
              <input className="radio-button"
                type="radio"
                name="userType"
                value="recipeSeeker"
                checked={userType === 'recipeSeeker'}
                onChange={() => setUserType('recipeSeeker')}
              />{' '}
              Recipe Seeker
              <br />
              <input className="radio-button"
                type="radio"
                name="userType"
                value="admin"
                checked={userType === 'admin'}
                onChange={() => setUserType('admin')}
              />{' '}
              Admin
              <br />
              <input className="radio-button"
                type="radio"
                name="userType"
                value="chef"
                checked={userType === 'chef'}
                onChange={() => setUserType('chef')}
              />{' '}
              Chef
              <br />
              <input className="radio-button"
                type="radio"
                name="userType"
                value="vendor"
                checked={userType === 'vendor'}
                onChange={() => setUserType('vendor')}
              />{' '}
              Vendor
              <br />
              <input className="radio-button"
                type="radio"
                name="userType"
                value="nutritionist"
                checked={userType === 'nutritionist'}
                onChange={() => setUserType('nutritionist')}
              />{' '}
              Nutritionist
            </label>
            <br />
            <button className='button-signin' type="button" onClick={handleSignIn}>
              Sign In
            </button>
            
          </div>
          <div className="image-side1">
          
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
