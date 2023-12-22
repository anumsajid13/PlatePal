
import React from 'react';

const CollaborationCard = ({ collaboration }) => (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px', borderRadius: '5px' }}>
      <h3>{collaboration.chef}</h3>
      <p><strong>Vendor:</strong> {collaboration.vendor}</p>
    </div>
  );

  export default CollaborationCard;
  