// SignUp.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import useNavbarStore from './navbarStore';

const SignUpPage = () => {
  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();

  return (
    <div className='signin-outerbody' style={{minHeight:"100vh"}}>
      <nav className="navbar-landingpage" style={{ height: '45px' }}>
        <div className="logo">Plate Pal</div>
        <div className="nav-links">
          <Link
            to="/"
            style={{ color: 'black', textDecoration: 'none' }}
            onClick={() => setActiveLink('Home')}
            className={activeLink === 'Home' ? 'active-link' : ''}
          >
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
      <div className="signup-page">
        
        <div className="outer-signup-card">
        
          <SignUpCard role="I am a Recipe Seeker" icon="🍲" to="/signup/recipe-seeker" />
          <SignUpCard role="I am a Nutritionist" icon="🥦" to="/signup/nutritionist" />
          <SignUpCard role="I am a Chef" icon="👨‍🍳" to="/signup/chef" />
          <SignUpCard role="I am a Vendor" icon="🛒" to="/signup/vendor" />
        </div>
      </div>
    </div>
  );
};

const SignUpCard = ({ role, icon, to }) => {
  return (
    <Link to={to} className="signup-card">
      <div className="card-icon">{icon}</div>
      <h3>{role}</h3>
    </Link>
  );
};

export default SignUpPage;
