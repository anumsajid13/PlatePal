import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import '../assets/styles/editProfile.css';
const PasswordReset=()=>{

    const { token } = useTokenStore();
    const navigate = useNavigate();
  
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
  
    const handleOldPasswordChange = (e) => {
      setOldPassword(e.target.value);
    };
  
    const handleNewPasswordChange = (e) => {
      setNewPassword(e.target.value);
    };
  
    const handleUpdate = async () => {
      try {
        const response = await fetch(`http://localhost:9000/vendor/forgotpassword`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update password');
        }
  
        // Optionally, you may want to clear the password fields or handle the success in a different way
        setOldPassword('');
        setNewPassword('');
  
        navigate('/vendor/profile');
        alert('Password updated successfully');
      } catch (error) {
        alert('Error updating password:', error.message);
      }
    };
  
    return (
      <>
        <NavigationBar />
        <div className="editProfileContainer">
          <div className="header">
            <Link to="/vendor/profile" className="backButton">
              <FaArrowLeft /> Back
            </Link>
          </div>
          <h2>Edit Vendor Password</h2>
          <div className="formContainer">
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
  
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
  
            <button onClick={handleUpdate}>Update Password</button>
          </div>
        </div>
      </>
    );
  };
  

export default PasswordReset;