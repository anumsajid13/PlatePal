// SignInPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNavbarStore from './navbarStore';
import useTokenStore from './tokenStore';
import './SignIn.css';

const AlertMessage = ({ message, onClose }) => {
  return (
    <div className="alert-message">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const SignInPage =  () => {
  const navigate = useNavigate();
  const { setToken } = useTokenStore();
  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('recipeSeeker');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

  
  const handleCloseError = () => {
    setShowError(false);
  };  

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
        await signInChef();
        break;
      case 'vendor':
      await signInVendor();
        break;
      case 'nutritionist':
        signInNutritionist();
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
        localStorage.setItem('token', data.token);
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
        setErrorMessage(data.message);
        setShowError(true);
        return;
      }

      const data = await response.json();
      console.log('Admin Sign In successful:', data.token);
    //  alert('Admin Sign In successful');
   
      // Store the admin token using the token store (if needed)
      setToken(data.token);
      setShowError(true);
      setErrorMessage('Successfully Signed In');
      navigate('/admin');

    } catch (error) {
      console.error('Error during Sign In:', error.message);
      setShowError(true);
      setErrorMessage('Wrong Credentials. Please Try again');
    }
  };

  
  const signInVendor = async () => {
    try {
      const response = await fetch('http://localhost:9000/vendor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      let data; // Declare 'data' outside of the if block
  
      if (!response.ok) {
        data = await response.json();
        console.error('Vendor failed to login:', data.error);
        alert('Vendor Sign In failed');
        return;
      }
  
      data = await response.json();
      console.log('Vendor Sign In successful:', data.token);
      alert('Vendor Sign In successful');
  console.log('Token:', data.token);
      setToken(data.token);
  
      navigate('/Vendor/Mainpage');
    } catch (error) {
      console.error('Error during vendor Sign In:', error.message);
      alert('Could not sign in as vendor');
    }
  };
  
  const signInChef = async () => {
   
      try{

        const response = await fetch('http://localhost:9000/chef/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
        });
            const data = await response.json();

            console.log(data.message)

            if (!response.ok) {
                setErrorMessage(data.message);
                setShowError(true);
                return;
            }

            console.log('Token:', data.token);
            setToken(data.token);
            alert('Chef log in successful');
            navigate('/Chef/Mainpage');
      }
      catch(error){
        console.error('Error during Sign In:', error.message);
        setShowError(true);
        setErrorMessage('Server Error');
      }

  };


  const signInNutritionist = async () => {
    try {
      const response = await fetch('http://localhost:9000/n/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Nutritionist Sign In failed:', data.error);
        setShowError(true);
        setErrorMessage('Wrong Credentials. Please Try again');
        return;
      }

      const data = await response.json();
      console.log('Nutritionist Sign In successful:', data.token);
 //     alert('Nutritionist Sign In successful');

      // Store the nutritionist token using the token store (if needed)
      setToken(data.token);
      navigate('/n/mainpage');

      // Redirect to the nutritionist route or any other page as needed
    } catch (error) {
      console.error('Error during Nutritionist Sign In:', error.message);
      alert('Could not sign in as nutritionist');
    }
  };

  return (
    <div className='signin-outerbody'>
      <nav className="navbar-landingpage" style={{ height: '45px' }}>
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
            <label className="user-type">
            User Type
            
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="recipeSeeker">Recipe Seeker</option>
                <option value="admin">Admin</option>
                <option value="chef">Chef</option>
                <option value="vendor">Vendor</option>
                <option value="nutritionist">Nutritionist</option>
              </select>
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

      {showError && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Message</h2>
                        <p>{errorMessage}</p>
                        <button onClick={handleCloseError}>Close</button>
                    </div>
                </div>
       )}
    </div>
  );
};

export default SignInPage;
