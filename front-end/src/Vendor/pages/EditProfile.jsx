import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import '../assets/styles/editProfile.css';

const EditVendorProfile = () => {
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    name: '',
    username: '',
    email: '',
  });
 
  const [profilePictureFile, setProfilePictureFile] = useState(null);
   const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePictureFile(file);
};
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9000/vendor/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch vendor details');
        }

        const vendorData = await response.json();
        setVendor(vendorData);
      } catch (error) {
        console.error('Error fetching vendor details:', error.message);
      }
    };

    fetchVendorDetails();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor((prevVendor) => ({
      ...prevVendor,
      [name]: value,
    }));
  };



  const handleUpdate = async () => {
    try {
  

      const response = await fetch(`http://localhost:9000/vendor/editprofile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendor),
    
      });

      if (!response.ok) {
        throw new Error('Failed to update vendor profile');
      }
      const vendorData = await response.json();
      setVendor(vendorData);
      navigate('/vendor/profile');
      alert('Vendor profile updated successfully');
    } catch (error) {
      alert('Error updating vendor profile:', error.message);
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
        <h2>Edit Vendor Profile</h2>
        <div className="formContainer">
       
            <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={vendor.name}
            onChange={handleInputChange}
          />

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={vendor.username}
            onChange={handleInputChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={vendor.email}
            onChange={handleInputChange}
          />

          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureChange }
            className='file'
          />
         
          <button onClick={handleUpdate}>Update Profile</button>
       
        </div>
      </div>
    </>
  );
};

export default EditVendorProfile;
