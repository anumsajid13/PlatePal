import React, { useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';
import './Acceptcert.css'; // Import your CSS file
import AdminNav from '../components/AdminNav';
import PopupMessage from './PopupMessage';
import { BASE_URL } from '../../url';

const ViewCertifications = () => {
  const [nutritionists, setNutritionists] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null);

  const [message, setMessage] = useState('');
  const token = useTokenStore((state) => state.token);

    const fetchNutritionists = async () => {
      try {
        // Fetch data from the backend with bearer token
        const response = await fetch(`${BASE_URL}/admin/view-certifications`, {
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
        const response1 = await fetch(`${BASE_URL}/admin/view-chef-certifications`, {
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

        console.log(data1.chefs ,"lol")
        setChefs(data1.chefs);


         // Fetch data from the backend with bearer token
         const response2 = await fetch(`${BASE_URL}/admin/view-vendor-certifications`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response2.ok) {
          throw new Error(`HTTP error! Status: ${response1.status}`);
        }
        const data2 = await response2.json();

        console.log(data2.vendors ,"lol")
        setVendors(data2.vendors);
        



      } catch (error) {
        console.error(error);
      }
    };

   

  useEffect(() => {
    fetchNutritionists();
    // ... (rest of the useEffect code)
  }, [token, popupMessage]);

  const handleAccept = async (professionalId) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/allow-chef-signup/${professionalId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allowSignup: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
     // setMessage(data.message);
     setPopupMessage(data.message);
     fetchNutritionists();


      // You may want to refresh the certifications after accepting
      // Call fetchNutritionists() or any other appropriate function here

    } catch (error) {
      console.error(error);
      setPopupMessage('Error accepting certification');

     // setMessage('Error accepting certification');
    }
  };

  const handleReject = async (professionalId) => {
    console.log(professionalId)
    try {
      const response = await fetch(`${BASE_URL}/admin/disallow-chef-signup/${professionalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
    //  setMessage(data.message);
    setPopupMessage(data.message);
      fetchNutritionists();
      // You may want to refresh the certifications after rejecting
      // Call fetchNutritionists() or any other appropriate function here

    } catch (error) {
      console.error(error);
      setMessage('Error rejecting certification');
    }
  };

  const handleAccept1 = async (professionalId) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/allow-nutritionist-signup/${professionalId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allowSignup: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
    //  setMessage(data.message);
      setPopupMessage(data.message);
      fetchNutritionists();

      // You may want to refresh the certifications after accepting
      // Call fetchNutritionists() or any other appropriate function here

    } catch (error) {
      console.error(error);
      setMessage('Error accepting certification');
    }
  };

  const handleReject1 = async (professionalId) => {
    console.log(professionalId)
    try {
      const response = await fetch(`${BASE_URL}/admin/disallow-nutritionist-signup/${professionalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
    //  setMessage(data.message);
    setPopupMessage(data.message);
    fetchNutritionists();

      // You may want to refresh the certifications after rejecting
      // Call fetchNutritionists() or any other appropriate function here

    } catch (error) {
      console.error(error);
      setMessage('Error rejecting certification');
    }
  };

  const handleAccept2 = async (professionalId) => {

    console.log("id",professionalId)
    try {
      const response = await fetch(`${BASE_URL}/admin/allow-vendor-signup/${professionalId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("message", data)
     // setMessage(data.message);
     setPopupMessage(data.message);
     fetchNutritionists();


      // You may want to refresh the certifications after accepting
      // Call fetchNutritionists() or any other appropriate function here

    } catch (error) {
      console.error(error);
      setMessage('Error accepting certification');
    }
  };

  const handleReject2 = async (professionalId) => {
    console.log(professionalId)
    try {
      const response = await fetch(`${BASE_URL}/admin/disallow-vendor-signup/${professionalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      //setMessage(data.message);
      setPopupMessage(data.message);
      fetchNutritionists();

      // You may want to refresh the certifications after rejecting
      // Call fetchNutritionists() or any other appropriate function here

    } catch (error) {
      console.error(error);
      setMessage('Error rejecting certification');
    }
  };

  const closePopup = () => {
    setPopupMessage(null);
  };

  return (
    <>
      <AdminNav />
      <>
        <h1>Users with Certifications</h1>
        {popupMessage && <PopupMessage message={popupMessage} onClose={closePopup} />}

        {message &&   <p >{message}</p>  }
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
                    <button className="accept-button" onClick={() => handleAccept1(nutritionist._id)}>
                      Accept
                    </button>
                    <button className="reject-button" onClick={() => handleReject1(nutritionist._id)}>
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


          {vendors.map((chef) => (
              chef.certificationImage && (
                <div key={chef._id} className="certification-card">
                  <h2>{chef.name}</h2>
                  <p>Certification:</p>
                  <iframe
                    title={chef.name}
                    src={`data:${chef.certificationImage.contentType};base64,${chef.certificationImage.data}`}
                  />
                  <div className="certification-buttons">
                    <button className="accept-button" onClick={() => handleAccept2(chef._id)}>
                      Accept
                    </button>
                    <button className="reject-button" onClick={() => handleReject2(chef._id)}>
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
