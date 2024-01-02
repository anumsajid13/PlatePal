import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import '../../Chef/pages/displayVendors.css';
import ReportChef from '../components/ReportChef';
import useTokenStore from '../../tokenStore';
import ChefGenericPopup from '../../Chef/components/ChefGenericPopup';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../url';

const DisplayChefs = () => {
  const { token } = useTokenStore();

  const [chef, setChef] = useState([]);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [selectedChefId, setSelectedChefId] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/vendor/BlockReport/getAllChefs`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setChef(data);
      } catch (error) {
        console.error('Error fetching vendors with ingredients:', error);
      }
    };

    fetchData();
  }, []);

  const handleReportClick = (vendorId) => {
    console.log('gee');
    setSelectedChefId(vendorId);
    setShowReportPopup(true);
  };

  const handleCloseReportPopup = () => {
    setShowReportPopup(false);
  };
const gotochat=()=>{
  navigate('/vendor/inbox')
};
  return (
    <>
      <NavigationBar />
      <div className="vendors-list">
        <h1>List of Chef</h1>
        {chef.map((item) => (
          <div key={item._id} className="vendor-item">
            {item.profilePicture && typeof item.profilePicture.contentType === 'string' ? (
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                <img src={`data:${item.profilePicture.contentType};base64,${item.profilePicture.data}`} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '70px', objectFit: 'cover' }} />
                {/* Other details or components */}
              </div>
            ) : (
              // Render something else or nothing if profilePicture is undefined
              <p>No profile picture available</p>
            )}

            {/* Additional details */}
            <h2 onClick={() => setSelectedVendor(item)} style={{ cursor: 'pointer' }}>
              {item.name}
            </h2>
            <h4 style={{ color: 'grey' }}>{item.email}</h4>
            <button className="vendor-chef-displayVendors" onClick={() => handleReportClick(item._id)}>
              Report
            </button>
            <button className="vendor-chef-displayVendors" onClick={gotochat}>
              Send message
            </button>
          </div>
        ))}
      </div>

      {showReportPopup && <ReportChef vendorId={selectedChefId} onClose={handleCloseReportPopup} />}
    </>
  );
};

export default DisplayChefs;
