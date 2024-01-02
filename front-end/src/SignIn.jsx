// SignInPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNavbarStore from './navbarStore';
import useTokenStore from './tokenStore';
import './SignIn.css';
import { BASE_URL } from './url';

console.log('BASE_URL:', BASE_URL);

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
       
    }
  };

  const signInRecipeSeeker = async () => {
    try {
        const response = await fetch(`${BASE_URL}/recepieSeeker/recipeSeeker_signin`, {
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
      const response = await fetch(`${BASE_URL}/admin/login`, {
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
      const response = await fetch(`${BASE_URL}/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      let data; // Declare 'data' outside of the if block
  
      if (!response.ok) {
        data = await response.json();
        alert(`Vendor failed to login:${data.error}`);
    
        //setShowError(true);
        return;
      }
  
      data = await response.json();
      console.log('Vendor Sign In successful:', data.token);
      alert('Vendor Sign In successful');
      console.log('Token:', data.token);
      setToken(data.token);
  
      navigate('/Vendor/Mainpage');
    } catch (error) {
      alert(`Error during vendor Sign In${error.message}`);
     // setShowError(true);
     
    }
  };
  
  const signInChef = async () => {
   
      try{

        const response = await fetch(`${BASE_URL}/chef/login`, {
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
            localStorage.setItem('token', data.token);
            setToken(data.token);
            //alert('Chef log in successful');
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
      const response = await fetch(`${BASE_URL}/n/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log(data.message)

      if (!response.ok) {
        console.error('Nutritionist Sign In failed:', data.error);
        setErrorMessage(data.error);
        setShowError(true);

        return;
      }

      console.log('Nutritionist Sign In successful:', data.token);
 //     alert('Nutritionist Sign In successful');

      // Store the nutritionist token using the token store (if needed)
      setToken(data.token);
      navigate('/n/mainpage');

      // Redirect to the nutritionist route or any other page as needed
    } catch (error) {
      console.error('Error during Nutritionist Sign In:', error.message);
      setShowError(true);
      setErrorMessage('Server Error');    }
  };

  return (
    <div className='signin-outerbody'>
      <nav className="navbar-landingpage">
        {/* Plate Pal logo on the left */}
        <div className="logo">Plate Pal</div>

        {/* Clickable components on the right */}
        <div className="nav-links">
          <Link
            to="/"
            style={{ color: 'black', textDecoration: 'none', marginRight:'5%'}}
            onClick={() => setActiveLink('Home')}
            className={activeLink === 'Home' ? 'active-link' : ''}
          >
            Home
          </Link>

              <button  className="landing-signin-button" > <Link to="/signin" className='link'>Log In</Link></button>
              <button  className="landing-signup-button-2"><Link to="/signup" className='link'>Sign Up</Link></button>
          
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
          <Link to="/forgot-password" className='chef-linkss' >forgot password ?</Link>
            <button className='button-signin' type="button" onClick={handleSignIn}>
              Sign In
            </button>
            
          </div>
          <div className="image-side1">
              
          </div>
          
        </div>
      </div>

      {showError && (
                <div className="model-modal-overlay">
                    <div className="model-modal">
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
