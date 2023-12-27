//chef sign up
import React, { useState } from 'react'; 
import './Nsignup.css'; 
import useNavbarStore from '../../navbarStore';
import { Link, useNavigate   } from 'react-router-dom';


const RegisterN = () =>{

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
    const [description, setDescription] = useState('');

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
          formData.append('description', description); // Add description to form data

          const response = await fetch('http://localhost:9000/n/signup', {
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
                        <h2 className='chl1'>Nutrionist Sign Up</h2>
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
                                Description:
                                <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="chef-form-input"
                                />
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
                            <button type="button" onClick={handleSignUp} disabled={loading} className="chef-form-button">
                            {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                    
                    </form>

                    <div className='chef-image-side'></div>
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

export default RegisterN;

