import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './editProfile.css';
import  useTokenStore  from  '../../tokenStore.js'
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '../../url';

const Edit_profil_user = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [creditCardInfo, setCreditCardInfo] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const token = useTokenStore((state) => state.token);
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
  
    useEffect(() => {
      fetch(`${BASE_URL}/recepieSeeker/finddetails/${userId}`, {
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
          setAddress(data.address || '');
          setCreditCardInfo(data.creditCardInfo || '');
          setProfilePicture(data.profilePicture);
        })
        .catch((error) => console.error('Error fetching user details:', error));
    }, []);
  
    const handleProfilePictureChange = (e) => {
      const file = e.target.files[0];
      setNewProfilePicture(file);
  
   
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const updatedProfileData = {
        name,
        email,
        address,
        creditCardInfo,
      };
  
      const formData = new FormData();
      formData.append('profilePicture', newProfilePicture);
      formData.append('profileData', JSON.stringify(updatedProfileData));
  
      try {
        const response = await fetch(`${BASE_URL}/recepieSeeker/updateProfile/${userId}`, {
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

  return (
    <>
      <Navbar activeLink="" />

      <div className="edit-profile-container">
        

        <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-picture-container">
            <label className="editprofile-label" htmlFor="profilePicture">
              
            </label>
            {profilePicture && (
              <img  style={{marginTop:"8%"}} className="profile-picture" src={profilePicture} alt="Profile" />
            )}
            <input style={{marginLeft:"20%"}}
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>

          <div className='recipeseeker-form' style={{marginLeft:"20%"}}>
          <label style={{marginTop:"5%"}} className="editprofile-label" htmlFor="name">
            Name:
          </label>
          <input
            className="editprofile-input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label style={{marginTop:"5%"}} className="editprofile-label" htmlFor="email">
            Email:
          </label>
          <input
            className="editprofile-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={{marginTop:"5%"}} className="editprofile-label" htmlFor="address">
            Address:
          </label>
          <input
            className="editprofile-input"
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label style={{marginTop:"5%"}} className="editprofile-label" htmlFor="creditCardInfo">
            Credit Card Info:
          </label>
          <input
            className="editprofile-input"
            type="text"
            id="creditCardInfo"
            value={creditCardInfo}
            onChange={(e) => setCreditCardInfo(e.target.value)}
          />

          
        </div>
          <button className="editprofile-button" type="submit">
            Save Changes
          </button>
          
        </form>
       
      </div>
    </>
  );
};

export default Edit_profil_user;
