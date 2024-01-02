import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import '../assets/styles/editProfile.css';
import {BASE_URL} from '../../url';
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
        const response = await fetch(`${BASE_URL}/vendor/forgotpassword`, {
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
  
       
        setOldPassword('');
        setNewPassword('');
  
     
        alert('Password updated successfully');
        navigate('/vendor/profile');
      } catch (error) {
        alert('Error updating password');
      }
    };
  const goBack = () => {
    navigate('/vendor/profile');
  };
    return (
      <>
        <NavigationBar />
        <div className="editProfileContainer">
          <div className="header">
            <button onClick={goBack} className="backButton">
              <FaArrowLeft /> Back
            </button>
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