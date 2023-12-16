//chef sign up
import React, { useState } from 'react'; 
import './chefSignup.css'; 
import useNavbarStore from '../../navbarStore';
import { Link } from 'react-router-dom';


const ChefSignUp = () =>{

    const { showDropdown, toggleDropdown, activeLink, setActiveLink } = useNavbarStore();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [certificationImage, setCertificationImage] = useState(null);
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
          formData.append('certificationImage', certificationImage);
    
          const response = await fetch('http://localhost:9000/chef/signup', {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            const data = await response.json();
            console.error('Sign Up failed:', data.message);

            return;
          }
    
          const data = await response.json();
          console.log(data.message);
          //will have a message in a pop up ..
        
          //then redirect to the login page
         
        } catch (error) {
          console.error('Error during Sign Up:', error.message);
          

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

            <div className="chef-signup-container">
                <div className='chef-for-flex'>
                    <form className="chef-card-container1">
                        <h2 className='chl1'>Chef Sign Up</h2>
                            <label className="chef-form-label">
                                 Name:
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
                            </label>
                            <label className="chef-form-label">
                                Username:
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" />
                            </label>
                            <label className="chef-form-label">
                                Email:
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
                            </label>
                            <label className="chef-form-label">
                                Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
                            </label>
                            <label className="chef-form-label">
                                Profile Picture:
                            <input className='Profile-Picture' type="file" onChange={(e) => setProfilePicture(e.target.files[0])}  />
                            </label>
                            <label className="chef-form-label">
                                Certificate PDF:
                            <input className='Profile-Picture' type="file" onChange={(e) => setCertificationImage(e.target.files[0])}  />
                            </label>
                            <button type="button" onClick={handleSignUp} disabled={loading} className="form-button">
                            {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                    
                    </form>

                    <div className='chef-image-side'></div>
                </div>
            </div>

        </>

    );

};

export default ChefSignUp;

