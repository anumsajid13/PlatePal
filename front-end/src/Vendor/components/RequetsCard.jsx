
import React from 'react';

const CollaborationRequestCard = ({ request }) => (
  <div className='request'>
    <label>{request.chefName} sent you a collaboration request for the recipe {request.recipeName}.</label>
    <label>{request.isAccepted}</label>
    <label>{request.time}</label>
  </div>
);

export default CollaborationRequestCard;
