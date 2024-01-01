// components/ChefChat.js
import React, { useState, useEffect } from 'react';
import './ChefChat.css';
import useTokenStore from '../../tokenStore.js';
import { jwtDecode } from 'jwt-decode';

const ChefChat = () => {
  const [nutritionists, setnutritionists] = useState([]);
  const [selectednutritionist, setSelectednutritionist] = useState(null);
  const [selectednutritionistsName, setSelectednutritionistsName] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const token = useTokenStore.getState().token;
  console.log(token)
  const decodedToken = jwtDecode(token);
  console.log('hhehe',decodedToken.name)
  const currentUserId = decodedToken.name;
  console.log('decodedToken',decodedToken)

  useEffect(() => {
    fetch('http://localhost:9000/recepieSeeker/allNutritionists')
      .then((response) => response.json())
      .then((data) => setnutritionists(data.nutritionists))
      .catch((error) => console.error('Error fetching nutritionists:', error));
  }, []);

  useEffect(() => {
    let isMounted = true;
  
    if (selectednutritionist) {
     
      setChatMessages([]);
      document.body.classList.add('no-scroll');
   
      fetch(`http://localhost:9000/recepieSeeker/UserNutrchatMessages/${selectednutritionist}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Response:', response); // Log the response here
        return response.json(); // Continue parsing the response body as JSON
      })
        .then((data) => {
          if (isMounted) {
            console.log('Fetched messages:', data);
           // const newMessages = Array.isArray(data.messages) ? data.messages : [data.messages];
            //setChatMessages((prevChatMessages) => [...(prevChatMessages || []), ...newMessages]);
            setChatMessages(data.messages)
          }
        })
        .catch((error) => console.error('Error fetching chat messages:', error));
    }
    return () => {
      isMounted = false;
    };
  }, [selectednutritionist]);
  
  

  const handleChefClick = (NutId, name) => {
    setSelectednutritionist(NutId);
    setSelectednutritionistsName(name)
  };

  const handleSendMessage = () => {
    if (selectednutritionist && messageInput.trim() !== '') {
    
      fetch(`http://localhost:9000/recepieSeeker/sendMessageToNutritionist/${selectednutritionist}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageContent: messageInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data",data);
          setChatMessages((prevChatMessages) => {
            const updatedMessages = Array.isArray(prevChatMessages) ? prevChatMessages : [];
            return [
              ...updatedMessages,
              {
                message: messageInput,
                author: currentUserId,
                time: new Date().toISOString(),
              },
            ];
          });
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
          {nutritionists.map((nutritionist) => (
            <div
              key={nutritionist._id}
              className={`chef-option ${selectednutritionist === nutritionist._id ? 'selected' : ''}`}
              onClick={() => handleChefClick(nutritionist._id, nutritionist.name)}
            >
               
              {nutritionist.profilePicture && typeof nutritionist.profilePicture === 'string' ? (
                <div style={{display:"flex", gap:"10px"}}>
                 <img
                  src={nutritionist.profilePicture}
                  style={{ width: '45px', height: '45px', borderRadius: '20px' }}
                />
                  <p>{nutritionist.name}</p>
                </div>
               
              ) : (
                <img
                  src={`data:image/jpeg;base64,${nutritionist.profilePicture}`}
                  alt={`Chef ${nutritionist.name}`}
                  style={{ width: '40px', height: '40px', borderRadius: '20px' }}
                />
              )}
              
            </div>
          ))}
        </div>
      </div>
      <div className="chef-main">
        <div className="chat-box">
          {selectednutritionist && (
            <>
              <div className="chat-header-user">
                <h2>Nutrionist {selectednutritionistsName}</h2>
              </div>
              <div className="chat-messages-between-chefanduser">
              {console.log("chatMessages ",chatMessages)}
              {chatMessages && Array.isArray(chatMessages) && chatMessages.length > 0 ? (
                chatMessages.map((message, index) => (
                  <div key={index} className={`message-to-chef ${message && message.author === currentUserId ? 'other-user' : ''}`}>
                    <div className="author-textmsg">
                      <p className="author">
                        {console.log(currentUserId)}
                        {message && message.author === currentUserId ? 'You' : ( message.author)}
                      </p>
                      <p className="message-text">{message && message.message}</p>
                    </div>
                    <p className="time">{message && new Date(message.time).toLocaleTimeString()}</p>
                  </div>
                ))
              ) : (
                <p style={{marginTop:"10%"}}>No messages yet</p>
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
