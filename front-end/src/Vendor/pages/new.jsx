import React, { useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';

const CollaborationRequests = () => {
  const { token } = useTokenStore();
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborationRequests = async () => {
      try {
        const response = await fetch('http://localhost:9000/collaboration', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch collaboration requests');
        }

        const data = await response.json();
        setCollaborationRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collaboration requests:', error);
        setLoading(false);
      }
    };

    fetchCollaborationRequests();
  }, [token]);

  return (
    <div>
      <h1>Collaboration Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {collaborationRequests.map(request => (
            <div key={request._id}>
              {/* Display collaboration request details */}
              <p>Vendor: {request.vendor}</p>
              <p>Chef: {request.chef}</p>
              {/* Add more details as needed */}

              {/* Add a button to accept or reject the collaboration request */}
              <button>Accept</button>
              <button>Reject</button>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborationRequests;
