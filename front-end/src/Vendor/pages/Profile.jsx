import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import useTokenStore from '../../tokenStore';
import '../assets/styles/vendorProfile.css';
import defaultProfilePicture from '../assets/images/vendor_signup.svg';
import NavigationBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';

const VendorProfile = () => {
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    name: '',
    username: '',
    email: '',
    profilePicture: null,
    certificationImage: null,
  });

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
  }, [ token]);
  const HandleEdit = () => {
    navigate('/Vendor/editProfile');
      };
  return (
    <>
      <NavigationBar />
      <div className="profilePageContainer">
        <div className="profileHeader">
          <Link to="/Vendor/Mainpage" className="backButton">
            <FaArrowLeft /> Back
          </Link>
          
          <h1>
            {vendor.name}'s Profile
            <FaEdit className="editIcon" onClick={HandleEdit} />
          </h1>
       
        </div>
        <div className="profileContent">
          <div className="profilePictureContainer">
            <img
              src={vendor.profilePicture || defaultProfilePicture}
              alt="Profile"
              className="profilePicture"
            />
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
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorProfile;
