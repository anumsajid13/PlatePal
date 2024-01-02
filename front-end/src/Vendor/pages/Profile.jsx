import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import '../assets/styles/vendorProfile.css';
import defaultProfilePicture from '../assets/images/vendor_signup.svg';
import NavigationBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';
import {BASE_URL} from '../../url';

const VendorProfile = () => {
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    name: '',
    username: '',
    email: '',
    profilePicture: null,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/vendor/profile`, {
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
        console.log(vendorData.profilePicture.data);
      } catch (error) {
        console.error('Error fetching vendor details:', error.message);
      }
    };

    fetchVendorDetails();
  }, [ token]);
  const HandleEdit = () => {
    navigate('/Vendor/editProfile');
      };
  const handleReset = async () => {
    navigate('/vendor/reset-password');
  }
  const handleDelete = () => {
    setShowConfirmationModal(true);
  };
  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/vendor/deleteprofile`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Profile deleted successfully');
        navigate('/'); 
      } else {
        throw new Error('Failed to delete profile');
      }
    } catch (error) {
      alert('Error deleting vendor profile:', error.message);
    } finally {
  
      setShowConfirmationModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
  };
  return (
    <>
      <NavigationBar />
      <div className="profilePageContainer">
     {/*    <div className="profileHeader">
          <button to="/Vendor/Mainpage" className="backButton">
            <FaArrowLeft /> Back
          </button>

        </div> */}
        <h1>
            {vendor.name}'s Profile
            <button className="vendoreditButton" onClick={HandleEdit}>
                <FaEdit /> Edit Information
              </button>
          </h1>
        <div className="profileContent">
          <div className="profilePictureContainer">
          {vendor.profilePicture && (
            <img src={vendor.profilePicture ? `data:image/jpeg;base64,${vendor.profilePicture}`: require('../assets/images/no-profile-picture-15257.svg').default}  className="profilePicture"  /> 
          
          )}
          {!vendor.profilePicture && (
            <img src={defaultProfilePicture} className="profilePicture" /> 
          )}
          </div>
          <div className="profileDetails">
            <p>
              <strong>Name:</strong> {vendor.name}
            </p>
            <p>
              <strong>Username:</strong> {vendor.username}
            </p>
            <p>
              <strong>Email:</strong> {vendor.email}
            </p>
            <p>
              <strong>Balance:</strong> Pkr. {vendor.balance}
            </p>
            <button className="passwordReset" onClick={handleReset}>Reset Password</button>
            <button onClick={handleDelete} className='deleteConfirm'>Delete Profile</button>
          {showConfirmationModal && (
          <div className="confirmation-modal">
            <p>Warning: Deleting your profile will remove all your data. Are you sure?</p>
            <button onClick={confirmDelete} className='deleteConfirm'> Delete</button>
            <button onClick={cancelDelete} className='cancelButton'>Cancel</button>
          </div>
        )}
          </div>
         
        </div>
      </div>
    </>
  );
};

export default VendorProfile;