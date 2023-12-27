// SignUp.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import useNavbarStore from './navbarStore';

const SignUpPage = () => {
  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();

  return (
    <div className='signin-outerbody' style={{minHeight:"100vh"}}>
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
