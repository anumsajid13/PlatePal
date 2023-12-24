// components/ChefChat.js
import React, { useState, useEffect } from 'react';
import './ChefChat.css';
import useTokenStore from '../../tokenStore.js';
import { jwtDecode } from 'jwt-decode';

const ChefChat = () => {
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const [selectedChefName, setSelectedChefName] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const token = useTokenStore.getState().token;
  const decodedToken = jwtDecode(token);
  const currentUserId = decodedToken.id;
  console.log('decodedToken',decodedToken)

  useEffect(() => {
    fetch('http://localhost:9000/recepieSeeker/allChefs')
      .then((response) => response.json())
      .then((data) => setChefs(data.chefs))
      .catch((error) => console.error('Error fetching chefs:', error));
  }, []);

  useEffect(() => {
    let isMounted = true;
  
    if (selectedChef) {
     
      setChatMessages([]);
      document.body.classList.add('no-scroll');
   
      fetch(`http://localhost:9000/recepieSeeker/chatMessages/${selectedChef}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (isMounted) {
            console.log('Fetched messages:', data);
            setChatMessages(data.messages);
          }
        })
        .catch((error) => console.error('Error fetching chat messages:', error));
    }
    return () => {
      isMounted = false;
    };
  }, [selectedChef]);
  
  

  const handleChefClick = (chefId, chefname) => {
    setSelectedChef(chefId);
    setSelectedChefName(chefname)
  };

  const handleSendMessage = () => {
    if (selectedChef && messageInput.trim() !== '') {
    
      fetch(`http://localhost:9000/recepieSeeker/sendMessageToChef/${selectedChef}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageContent: messageInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          setChatMessages((prevChatMessages) => [...prevChatMessages, messageInput]);
          console.log('Message sent successfully:', data);
        })
        .catch((error) => console.error('Error sending message:', error));

      
      setMessageInput('');
    }
  };


  return (
    <div className="chef-chat-container">
      <div className="chef-text-sidebar">
        <div className="chef-options">
          {chefs.map((chef) => (
            <div
              key={chef._id}
              className={`chef-option ${selectedChef === chef._id ? 'selected' : ''}`}
              onClick={() => handleChefClick(chef._id, chef.name)}
            >
                {console.log("Profile pic data",chef.profilePicture)}
              {chef.profilePicture && typeof chef.profilePicture === 'string' ? (
                <div style={{display:"flex", gap:"10px"}}>
                 <img
                  src={chef.profilePicture}
                  style={{ width: '45px', height: '45px', borderRadius: '20px' }}
                />
                  <p>{chef.name}</p>
                </div>
               
              ) : (
                <img
                  src={`data:image/jpeg;base64,${chef.profilePicture}`}
                  alt={`Chef ${chef.name}`}
                  style={{ width: '40px', height: '40px', borderRadius: '20px' }}
                />
              )}
              
            </div>
          ))}
        </div>
      </div>
      <div className="chef-main">
        <div className="chat-box">
          {selectedChef && (
            <>
              <div className="chat-header">
                <h2>Chef {selectedChefName}</h2>
              </div>
              <div className="chat-messages-between-chefanduser">
              {console.log("Back to  divs: ")}
              {chatMessages && chatMessages.length > 0 ? (
                chatMessages.map((message, index) => (
                    <div key={index} className={`message-to-chef ${message.author !== currentUserId ? 'other-user' : ''}`}>
                    <div className="author-textmsg">
                    <p className="author">
                        {message.author != currentUserId ? 'You' : message.author}
                    </p>
                    <p className="message-text">{message.message}</p>
                    </div>   
                   
                    <p className="time">{new Date(message.time).toLocaleTimeString()}</p>

                    </div>
                ))
                ) : (
                <p>No messages yet</p>
                )}
                </div>
              <div className="messageToChef-byuser-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefChat;