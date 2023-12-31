import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import { jwtDecode } from 'jwt-decode';
import NutNav from '../components/N-Nav';
import { BASE_URL } from '../../url';

const NutritionistUserInbox = () => {
  const [recipeSeekers, setRecipeSeekers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const token = useTokenStore.getState().token;
  const decodedToken = jwtDecode(token);
  const currentUserId = decodedToken.name;

  useEffect(() => {
    fetch(`${BASE_URL}/n/allNutritionists`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Data received:', data);
        setRecipeSeekers(data);
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (selectedUser) {
      setChatMessages([]);
      document.body.classList.add('no-scroll');

      fetch(`${BASE_URL}/n/chatMessagesNutritionist/${selectedUser}`, {
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
  }, [selectedUser]);

  const handleNutritionistClick = (nutritionistId, nutritionistName) => {
    setSelectedUser(nutritionistId);
    setSelectedUserName(nutritionistName);
  };

  const handleSendMessage = () => {
    if (selectedUser && messageInput.trim() !== '') {
      fetch(`${BASE_URL}/n/sendMessageToUserNutritionist/${selectedUser}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageContent: messageInput }),
      })
        .then((response) => response.json())
        .then((data) => {
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
        })
        .catch((error) => console.error('Error sending message:', error));

      setMessageInput('');
    }
  };

  return (
    <>
      <NutNav />

      <div className="chef-chat-container">
        <div className="chef-text-sidebar">
          <div className="chef-options">
            {recipeSeekers &&
              recipeSeekers.map((user) => (
                <div
                  key={user._id}
                  className={`chef-option ${
                    selectedUser === user._id ? 'selected' : ''
                  }`}
                  onClick={() => handleNutritionistClick(user._id, user.name)}
                >
                  <p>{user.name}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="chef-main">
          <div className="chat-box">
            {selectedUser && (
              <>
                <div className="chat-header" style={{ backgroundColor: 'green' }}>
                  <h2>{selectedUserName}</h2>
                </div>
                <div className="chat-messages-between-chefanduser">
                  {chatMessages && chatMessages.length > 0 ? (
                    chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`message-to-chef ${
                          message.author === currentUserId ? 'other-user' : ''
                        }`}
                      >
                        <div className="author-textmsg">
                          <p className="author">
                            {message.author === currentUserId ? 'You' : message.author}
                          </p>
                          <p className="message-text">{message.message}</p>
                        </div>
                        <p className="time">
                          {new Date(message.time).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No messages yet</p>
                  )}
                </div>
                <div className="messageToChef-byuser-input input">
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
    </>
  );
};

export default NutritionistUserInbox;
