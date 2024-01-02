import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import useTokenStore from '../../tokenStore.js';
import '../assets/styles/chat.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const VendorInbox = () => {
  const [chefs, setChefs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const navigate = useNavigate();
const {token} = useTokenStore();
  const currentUserId =token.name;

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
    }
  }, [selectedUser]);

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
  
      const response = await fetch('http://localhost:9000/chatWithchef/chefs', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Log data to check its structure
      console.log('Fetched chefs data:', data);
  
      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setChefs(data);
        console.log(' data set:', data._id);
        console.log('Chefs data set:',chefs._id);
      } else {
        console.error('Error: Fetched data is not an array');
      }
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoadingVendors(false);
    }
  };
  
  const handleChefSelection = async (chefId, chefName) => {
    console.log('Selected chef:', chefId);
    console.log('imgere')
    if(chefId==undefined){
      chefId=null;
    }
    setSelectedUser(chefId);
    setSelectedUserName(chefName);
    await fetchMessages(chefId);
  };

  const fetchMessages = async (chefId) => {
    try {
      setLoadingMessages(true);

      const response = await fetch(`http://localhost:9000/chatWithchef/retrievemessages/${chefId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setChatMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch('http://localhost:9000/chatWithchef/sendmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chefId: selectedUser,
          message: messageInput,
          time: new Date(),
        }),
      });
      const data = await response.json();
      await fetchMessages(selectedUser);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBackButton = () => {
    setSelectedUser(null);
    setSelectedUserName(null);
    navigate('/Vendor/Mainpage');
  };

  console.log('chatMessages:', chatMessages);

  return (
    <>
      <NavigationBar />

      <div className="vendor-chat-container">
        <div className="vendor-text-sidebar">
          <div className="Bbutton">
            <button className="chatBackButton" onClick={handleBackButton}>
            <FaArrowLeft style={{ color: "white", fontSize: "20px" }} />
            </button>
          </div>
          <div className="vendor-buttons">
            {loadingVendors ? (
              <p>Loading vendors...</p>
            ) : (
              chefs.map((chef) => (
                <button key={chef.chefId} onClick={() => handleChefSelection(chef._id, chef.name)}>
                  {chef.name}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="vendor-main">
          <div className="chat-box">
            {selectedUser && (
              <>
                <div className="chat-header">
                  <h3>Chef {selectedUserName}</h3>
                </div>
                <div className="chat-messages-between-vendoranduser">
                  {loadingMessages ? (
                    <p>Loading messages...</p>
                  ) : (chatMessages && chatMessages.length > 0) ? (
                    chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`message-to-chef ${message.author === currentUserId ? 'other-user' : ''}`}
                      >
                        <p>{message.author}</p>
                        <p>{message.message}</p>
                        <small>{new Date(message.time).toLocaleString()}</small>
                      </div>
                    ))
                  ) : (
                    <p className='noMessage'>No messages yet</p>
                  )}
                </div>
                <div className="messageToVendor-byuser-input">
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

export default VendorInbox;
