
import React from 'react';

const CollaborationRequestCard = ({ request }) => (
  <div className='request'>
    {console.log('request', request)}
    {console.log("im doing work")}
    <h1>im here</h1>
    <label>{request.chef} sent you a collaboration request.</label>
    <label>{request.Time}</label>
  </div>
);

export default CollaborationRequestCard;
