
import React, { useState } from 'react';
import '../assets/styles/signup.css'; 
import useNavbarStore from '../../navbarStore';
import Message from '../components/message';
import { Link } from 'react-router-dom';

const VendorSignUp = () => {

  const { showDropdown, toggleDropdown, activeLink, setActiveLink, searchInput, setSearchInput } = useNavbarStore();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [Certification, setCertification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFormCleared, setIsFormCleared] = useState(false);
    const [message, setMessage] = useState('');

    const handleSignUp = async () => {
        setLoading(true);
    
        try {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('username', username);
          formData.append('email', email);
          formData.append('password', password);
          formData.append('profilePicture', profilePicture);
          formData.append('certificationImage', Certification);
    
          const response = await fetch('http://localhost:9000/vendor/register', {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            const data = await response.json();
            console.error('Sign Up failed:', data.message);
            setIsFormCleared(true);
            setMessage(data.message);
            return;
          }
    
          const data = await response.json();
          console.log('Sign Up successful:', data.message);
       /*    alert('Please wait for the admin to approve your account'); */
          alert('Sign Up successful!');
          //login the vendor after confiramtaion
        } catch (error) {
          console.error('Error during Sign Up:', error.message);
       
        } finally {
          setLoading(false);
        }
      };
      const handleWrongInfo = () => {
        setMessage('');
        if (isFormCleared) {
          setName('');
          setUsername('');
          setEmail('');
          setPassword('');
          setProfilePicture(null);
          setCertification(null);
          setIsFormCleared(false);
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
      {message && (
        <Message message={message} onClose={handleWrongInfo} />
      )}
      <div className="vendor-signup-container">
      <div className='for-flex'>
      <form className="card-container1">
      <h2 className='l1'>Vendor Sign Up</h2>
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
        <label className="form-label">
          Certification:
          <input className='Profile-Picture' type="file" onChange={(e) => setCertification(e.target.files[0])}  />
        </label>
        <button className="signup-button" type="button" onClick={handleSignUp} disabled={loading} >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        
      </form>
      <div className='Signupimage'>
             
      </div>
      </div>
      
    </div>
    </>
  );
};

export default VendorSignUp;
