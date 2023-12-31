//chef sign up
import React, { useState } from 'react'; 
import './chefSignup.css'; 
import useNavbarStore from '../../navbarStore';
import { Link, useNavigate   } from 'react-router-dom';
import { BASE_URL } from '../../url';


const ChefSignUp = () =>{

    const navigate = useNavigate();
    const { showDropdown, toggleDropdown, activeLink, setActiveLink } = useNavbarStore();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [certificationImage, setCertificationImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClose = () => {
        setShowSuccess(false);
        setShowError(false);
        if(showSuccess){
            navigate('/signin');
        }
        
      };

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
    
          const response = await fetch(`${BASE_URL}/chef/signup`, {
            method: 'POST',
            body: formData,
          });
    
          if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.message);
            setShowError(true);
            return;
          }
    
          const data = await response.json();
          console.log(data.message);
          setErrorMessage(data.message);
          setShowSuccess(true);
        
          //then redirect to the login page
          
         
        } catch (error) {
          console.error('Error during Sign Up:', error.message);
          setShowError(true);
          setErrorMessage('Server Error');

        } finally {
          setLoading(false);
        }
    };


    return (

        <>
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

            <div className="chef-signup-container">
                <div className='chef-chef-for-flex'>
                    <form className="chef-card-container1">
                        <h2 className='chl1'>Chef Sign Up</h2>
                            <label className="chef-form-label">
                                 Name:
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="chef-form-input" />
                            </label>
                            <label className="chef-form-label">
                                Username:
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="chef-form-input" />
                            </label>
                            <label className="chef-form-label">
                                Email:
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="chef-form-input" />
                            </label>
                            <label className="chef-form-label">
                                Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="chef-form-input" />
                            </label>
                            <label className="chef-form-label">
                                Profile Picture:
                            <input className='Profile-Picture' type="file" onChange={(e) => setProfilePicture(e.target.files[0])}  />
                            </label>
                            <label className="chef-form-label">
                                Certificate PDF:
                            <input className='Profile-Picture' type="file" onChange={(e) => setCertificationImage(e.target.files[0])}  />
                            </label>
                            <button type="button" onClick={handleSignUp} disabled={loading} className="chef-chef-form-button">
                            {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                    
                    </form>

                    <div className='chef-chef-chef-image-side'></div>
                </div>
            </div>

            {showSuccess && (
                <div className="modal-overlay">
                <div className="modal">
                    <h2>Sign Up Successful!</h2>
                    <p>{errorMessage}</p>
                    <button onClick={handleClose}  style={{ paddingLeft: '5px' }}>Close</button>
                </div>
                </div>
            )}

            {showError && (
                    <div className="modal-overlay">
                    <div className="modal">
                        <h2>Error</h2>
                        <p>{errorMessage}</p>
                        <button onClick={handleClose} style={{ paddingLeft: '5px' }}>Close</button>
                    </div>
                    </div>
                )}

        </>

    );

};

export default ChefSignUp;

