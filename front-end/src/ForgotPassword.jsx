import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNavbarStore from './navbarStore';
import './SignIn.css';
import './forgotPassword.css';

const ForgotPassword = () => {

    const {activeLink, setActiveLink} = useNavbarStore();
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('recipeSeeker');
    const navigate = useNavigate();
    const handleForgot =  async () => {

        try {
            const response = await fetch('http://localhost:9000/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, userType }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message); 
                navigate('/'); 
            } else {
                alert('Failed to send reset email'); 
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send reset email');
        }

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
            <div className="card-container-forgotpassword">
              <div className="form-side">
                <h2 className="heading1">Enter Email</h2>
                <label>
                  Email
                  <input style={{marginLeft: '30px'}}type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
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
                <button className='button-signin' type="button" onClick={handleForgot}>
                  Send
                </button>
                
              </div>
              <div className="image-side1-forgotPassword">
                  
              </div>
              
            </div>
          </div>

        </div>
      );
};

export default ForgotPassword;
