import React, { useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';
import './Acceptcert.css'; // Import your CSS file
import AdminNav from '../components/AdminNav';

const ViewCertifications = () => {
  const [nutritionists, setNutritionists] = useState([]);
  const [chefs, setChefs] = useState([]);
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        // Fetch data from the backend with bearer token
        const response = await fetch('http://localhost:9000/admin/view-certifications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNutritionists(data.nutritionists);

        // Fetch data from the backend with bearer token
        const response1 = await fetch('http://localhost:9000/admin/view-chef-certifications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response1.ok) {
          throw new Error(`HTTP error! Status: ${response1.status}`);
        }

        const data1 = await response1.json();
        setChefs(data1.chefs);

      } catch (error) {
        console.error(error);
      }
    };

    fetchNutritionists();
  }, [token]);

  const handleAccept = (professionalId) => {
    // Implement logic for accepting certification
    console.log(`Accept certification for professional ${professionalId}`);
  };

  const handleReject = (professionalId) => {
    // Implement logic for rejecting certification
    console.log(`Reject certification for professional ${professionalId}`);
  };

  return (
    <>
      <AdminNav />
      <>
        <h1>Nutritionists and Chefs with Certifications</h1>
        {nutritionists.length === 0 && chefs.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>No certifications to view.</p>
          </div>
        ) : (
          <div className="certifications-container">
            {/* Display Nutritionists */}
            {nutritionists.map((nutritionist) => (
              nutritionist.certificationImage && (
                <div key={nutritionist._id} className="certification-card">
                  <h2>{nutritionist.name}</h2>
                  <p>Certification:</p>
                  <iframe
                    title={nutritionist.name}
                    src={`data:${nutritionist.certificationImage.contentType};base64,${nutritionist.certificationImage.data}`}
                  />
                  <div className="certification-buttons">
                    <button className="accept-button" onClick={() => handleAccept(nutritionist._id)}>
                      Accept
                    </button>
                    <button className="reject-button" onClick={() => handleReject(nutritionist._id)}>
                      Reject
                    </button>
                  </div>
                </div>
              )
            ))}
            {/* Display Chefs */}
            {chefs.map((chef) => (
              chef.certificationImage && (
                <div key={chef._id} className="certification-card">
                  <h2>{chef.name}</h2>
                  <p>Certification:</p>
                  <iframe
                    title={chef.name}
                    src={`data:${chef.certificationImage.contentType};base64,${chef.certificationImage.data}`}
                  />
                  <div className="certification-buttons">
                    <button className="accept-button" onClick={() => handleAccept(chef._id)}>
                      Accept
                    </button>
                    <button className="reject-button" onClick={() => handleReject(chef._id)}>
                      Reject
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </>
    </>
  );
};

export default ViewCertifications;

