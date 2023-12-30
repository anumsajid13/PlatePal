import React, { useState } from 'react';
import { Link, useNavigate, useParams  } from 'react-router-dom';
import useNavbarStore from './navbarStore';
import './SignIn.css';

const ResetPassword = () => {

    const { userType, id, token } = useParams();
    const {activeLink, setActiveLink} = useNavbarStore();
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    const handleResetPassword = async () => {
        try {
          const response = await fetch(`http://localhost:9000/user/reset-password/${userType}/${id}/${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword }),
          });
    
          const data = await response.json();
          if (response.ok) {
            alert(data.message); 
            navigate('/signin')
          } else {
            alert('Failed to reset password'); 
          }
        } catch (error) {
          console.error(error);
          alert('Failed to reset password'); 
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
            <div className="card-container">
              <div className="form-side">
                <h2 className="heading1">Reset password</h2>
                <label>
                  New Password
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <br />
                <br />
           
            <br />
                <button className='button-signin' type="button" onClick={handleResetPassword}>
                  Update
                </button>
                
              </div>
              <div className="image-side1">
                  
              </div>
              
            </div>
          </div>

        </div>
      );
};

export default ResetPassword;
