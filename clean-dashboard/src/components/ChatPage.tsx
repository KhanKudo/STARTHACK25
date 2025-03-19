import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import { getProjectById } from '../utils/projectData';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{sender: string, text: string, timestamp: Date}>>([]);
  
  const project = getProjectById(projectId || '');
  
  useEffect(() => {
    // Add initial welcome message from the company
    if (project && messages.length === 0) {
      setMessages([
        {
          sender: 'company',
          text: `Welcome to the ${project.company} chat! How can we help you with our "${project.initiative}" initiative?`,
          timestamp: new Date()
        }
      ]);
    }
    
    // Scroll to bottom of chat on new messages
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [project, messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate company response after a short delay
    setTimeout(() => {
      const companyResponse = {
        sender: 'company',
        text: `Thank you for your interest in ${project?.initiative}. A representative will respond to your message shortly.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, companyResponse]);
    }, 1000);
  };
  
  const handleBackClick = () => {
    navigate(`/project/${projectId}`);
  };
  
  if (!project) {
    return (
      <div className="chat-page">
        <div className="top-bar-container">
          <TopBar title="Chat" />
        </div>
        <div className="chat-content">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          <div className="error-message">Project not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="top-bar-container">
        <TopBar title={`Chat with ${project.company}`} />
      </div>
      <div className="chat-content">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Project
        </button>
        
        <div className="chat-container">
          <div className="chat-header">
            <img 
              src={project.imageUrl} 
              alt={project.company}
              className="chat-company-image"
            />
            <div className="chat-company-info">
              <h2 className="chat-company-name">{project.company}</h2>
              <p className="chat-initiative-name">{project.initiative}</p>
            </div>
          </div>
          
          <div className="chat-messages" id="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'company-message'}`}
              >
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 