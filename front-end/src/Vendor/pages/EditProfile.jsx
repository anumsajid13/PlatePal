import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import '../assets/styles/editProfile.css';
import {BASE_URL} from '../../url';

const EditVendorProfile = () => {
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
 
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePicture(file);

 
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  
  useEffect(() => {
    fetch(`${BASE_URL}/vendor/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setUsername(data.username || '');
        setProfilePicture(data.profilePicture);
      })
      .catch((error) => console.error('Error fetching user details:', error));
  }, [token]);

  



  const handleUpdate = async (e) => {
  
  e.preventDefault();
  
      const updatedProfileData = {
        name,
        email,
        username,
      };
      const formData = new FormData();
      formData.append('profilePicture', newProfilePicture);
      formData.append('profileData', JSON.stringify(updatedProfileData));

      try {
        const response = await fetch(`${BASE_URL}/vendor/editprofile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        const data = await response.json();
        console.log(data.message);
        alert(data.message)
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile')
      }
  };


const goBack = () => {  
  navigate('/vendor/profile');
}
  return (
    <>
      <NavigationBar />
      <div className="editProfileContainer">
        <div className="header">
          <button className="backButton" onClick={goBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <form onSubmit={handleUpdate} className="edit-profile-form">
        <h2>Edit Vendor Profile</h2>
        <div className="formContainer">
            <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="profilePicture">Profile Picture:</label>
          <input style={{ marginLeft: "20%", border: "none" }}
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
         
          <button className="editprofile-button" type="submit">Update Profile</button>
       
        </div>
        </form>
      </div>
    </>
  );
};

export default EditVendorProfile;
