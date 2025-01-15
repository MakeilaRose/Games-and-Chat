import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Get the backend URL from environment variables or default to localhost
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

// Initialize connection to the backend
const socket = io(backendUrl);

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for chat messages from the server
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message); // Emit message to the server
      setMessage('');
    }
  };

  return (
    <div>
      <h1>React Chat App</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
