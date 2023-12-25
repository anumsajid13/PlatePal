import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import { useParams, Link } from 'react-router-dom';

const Inbox = () => {
  const { chefId } = useParams();
  const { token } = useTokenStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [inboxList, setInboxList] = useState([]);

  useEffect(() => {
    // Fetch messages for the selected chef
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:9000/inbox/retrieve-messages/${chefId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    // Fetch the list of inboxes
    const fetchInboxList = async () => {
      try {
        const response = await fetch('http://localhost:9000/inbox/inbox-list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch inbox list');
        }

        const data = await response.json();
        setInboxList(data.inboxes || []);
      } catch (error) {
        console.error('Error fetching inbox list:', error);
      }
    };

    fetchMessages();
    fetchInboxList();
  }, [chefId, token]);

  const handleSendMessage = async () => {
    try {
      const response = await fetch('http://localhost:9000/inbox/send-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chefId, message: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Refetch messages after sending a new message
      const data = await response.json();
      setMessages(data.messages || []);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h1>Chat with Chef</h1>
      <div>
        {/* List of chefs in the inbox */}
        <ul>
          {inboxList.map((inbox) => (
            <li key={inbox.chef._id}>
              <Link to={`/inbox/${inbox.chef._id}`}>{inbox.chef.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {/* Messages for the selected chef */}
        <h2>Chat with Chef</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.author}:</strong> {msg.message}
            </li>
          ))}
        </ul>
        {/* Message input and send button */}
        <div>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
