import React from 'react';
import '../assets/styles/message.css';
const Message = ({ message, onClose }) => {
  return (
    <div className="message">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Message;
