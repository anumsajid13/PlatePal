import React, { useState, useEffect } from 'react';
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore.js';
import { jwtDecode } from 'jwt-decode';

const ChefUserInboxx = () => {

    const [recipeSeekers, setRecipeSeekers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const token = useTokenStore.getState().token;
    const decodedToken = jwtDecode(token);
    const currentUserId = decodedToken.name;
    console.log('decodedToken',decodedToken)

    useEffect(() => {
        fetch('http://localhost:9000/chef/allUsers')
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
       
          console.log('selected user', selectedUser)
          fetch(`http://localhost:9000/chef/chatMessages/${selectedUser}`, {
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
      
      
    
      const handleChefClick = (chefId, chefname) => {
        setSelectedUser(chefId);
        setSelectedUserName(chefname)
      };
    
      const handleSendMessage = () => {
        
        if (selectedUser && messageInput.trim() !== '') {
        
          fetch(`http://localhost:9000/chef/sendMessageToUser/${selectedUser}`, {
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
    
    return(

        <>
            <ChefNav/>
            
            <div className="chef-chat-container">
            <div className="chef-text-sidebar">
                <div className="chef-options">
                {recipeSeekers && recipeSeekers.map((user) => (
                    <div
                    key={user._id}
                    className={`chef-option ${selectedUser === user._id ? 'selected' : ''}`}
                    onClick={() => handleChefClick(user._id, user.name)}
                    >
                     {console.log("Profile pic data",user.profilePicture)}
                     {user.profilePicture && typeof user.profilePicture === 'string' ? (
                        <div style={{display:"flex", gap:"10px", flexDirection:'row'}}>
                        <img
                          src={user.profilePicture}
                          style={{ width: '70px', height: '70px', borderRadius: '70px' }}
                        />
                          <p>{user.name}</p>
                        </div>
                      
                      ) : (
                        <div style={{display:"flex", gap:"10px", flexDirection:'row'}}>
                        <img
                          src={user.profilePicture.data ? `data:image/jpeg;base64,${user.profilePicture.data}` : require('../assets/images/no-profile-picture-15257.svg').default} 
                          alt={`Chef ${user.name}`}
                          style={{ width: '70px', height: '70px', borderRadius: '70px' }}
                        />
                          <p>{user.name}</p>
                        </div>
                      
                      )}
          
                 </div>
                ))}
                </div>
            </div>
            <div className="chef-main">
                <div className="chat-box">
                {selectedUser && (
                    <>
                    <div className="chat-header" style={{ backgroundColor: 'purple' }}>
                        <h2>{selectedUserName}</h2>
                    </div>
                    <div className="chat-messages-between-chefanduser">
                    {console.log("Back to  divs: ")}
                    {chatMessages && chatMessages.length > 0 ? (
                        chatMessages.map((message, index) => (
                            <div key={index} className={`message-to-chef ${message.author === currentUserId ? 'other-user' : ''}`}>
                            <div className="author-textmsg">
                            <p className="author">
                        {message.author === currentUserId ? 'You' : message.author}
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

        </>

    );


};

export default ChefUserInboxx;