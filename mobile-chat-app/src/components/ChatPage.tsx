import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileTopBar from './MobileTopBar';
import './ChatPage.css';

interface ProjectData {
  id: string;
  name: string;
  imageUrl: string;
  details: {
    company: string;
    challenge: string;
    description: string;
  };
}

const ChatPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{sender: string, text: string, timestamp: Date}>>([]);
  const [project, setProject] = useState<ProjectData | null>(null);
  
  // Simulating fetching project data - in a real app this would come from your data store
  useEffect(() => {
    if (projectId) {
      // For simplicity we'll set a mock project
      setProject({
        id: projectId,
        name: "Initiative Name",
        imageUrl: "https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?q=80&w=500&auto=format&fit=crop",
        details: {
          company: "Virgin Company",
          challenge: "Sustainability Challenge",
          description: "Initiative description goes here."
        }
      });
    }
  }, [projectId]);
  
  useEffect(() => {
    // Add initial welcome message from the company
    if (project && messages.length === 0) {
      setMessages([
        {
          sender: 'company',
          text: `Welcome to the ${project.details.company} chat! How can we help you with our "${project.name}" initiative?`,
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
        text: `Thank you for your interest in ${project?.name}. A representative will respond to your message shortly.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, companyResponse]);
    }, 1000);
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  if (!project) {
    return (
      <div className="chat-page mobile-chat-page">
        <MobileTopBar title="Chat" />
        <div className="chat-content">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
          <div className="error-message">Project not found.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileTopBar title={`Chat with ${project.details.company}`} />
      <div className="chat-page mobile-chat-page">
        <div className="chat-content">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
          
          <div className="chat-container">
            <div className="chat-header">
              <img 
                src={project.imageUrl} 
                alt={project.details.company}
                className="chat-company-image"
              />
              <div className="chat-company-info">
                <h2 className="chat-company-name">{project.details.company}</h2>
                <p className="chat-initiative-name">{project.name}</p>
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
    </>
  );
};

export default ChatPage; 