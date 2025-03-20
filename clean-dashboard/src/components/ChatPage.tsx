import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import { getProjectById } from '../utils/projectData';
import './ChatPage.css';

// Interface for employee chat data, used when chatting with an employee instead of a project
interface EmployeeChatData {
  id: string;
  name: string;
  company: string;
}

// Interface for chat message
interface ChatMessage {
  sender: string;
  text: string;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const { projectId, employeeId, employeeName, employeeCompany } = useParams<{ 
    projectId?: string;
    employeeId?: string;
    employeeName?: string;
    employeeCompany?: string;
  }>();
  
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Determine if we're in project chat or employee chat mode
  const isEmployeeChat = Boolean(employeeId);
  const project = !isEmployeeChat ? getProjectById(projectId || '') : null;
  
  // Create employee data object if in employee chat mode
  const employeeData: EmployeeChatData | null = isEmployeeChat ? {
    id: employeeId || '',
    name: (employeeName || '').replace(/-/g, ' '),
    company: (employeeCompany || '').replace(/-/g, ' ')
  } : null;
  
  useEffect(() => {
    // Add initial welcome message based on chat type
    if (messages.length === 0) {
      if (project) {
        // Project chat welcome message
        setMessages([
          {
            sender: 'company',
            text: `Welcome to the ${project.company} chat! How can we help you with our "${project.initiative}" initiative?`,
            timestamp: new Date()
          }
        ]);
      } else if (employeeData) {
        // Employee chat welcome message
        const formattedName = employeeData.name.split(' ').map(
          word => word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const formattedCompany = employeeData.company.split(' ').map(
          word => word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        setMessages([
          {
            sender: 'employee',
            text: `Hi there! This is ${formattedName} from ${formattedCompany}. How can I help you today?`,
            timestamp: new Date()
          }
        ]);
      }
    }
    
    // Scroll to bottom of chat on new messages
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [project, employeeData, messages.length]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      let responseMessage: ChatMessage;
      
      if (project) {
        // Project response
        responseMessage = {
          sender: 'company',
          text: `Thank you for your interest in ${project.initiative}. A representative will respond to your message shortly.`,
          timestamp: new Date()
        };
      } else if (employeeData) {
        // Employee response
        responseMessage = {
          sender: 'employee',
          text: `Thanks for your message! I'll look into this and get back to you as soon as possible.`,
          timestamp: new Date()
        };
      } else {
        // Fallback response
        responseMessage = {
          sender: 'system',
          text: `Thank you for your message. Someone will respond shortly.`,
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };
  
  const handleBackClick = () => {
    if (project) {
      navigate(`/project/${projectId}`);
    } else {
      navigate('/');  // Return to dashboard if coming from employee chat
    }
  };
  
  // Handle case where neither project nor employee data is available
  if (!project && !employeeData) {
    return (
      <div className="chat-page">
        <div className="top-bar-container">
          <TopBar title="Chat" />
        </div>
        <div className="chat-content">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          <div className="error-message">Chat not found.</div>
        </div>
      </div>
    );
  }

  // Determine chat title and entity information
  const chatTitle = project 
    ? `Chat with ${project.company}` 
    : `Chat with ${employeeData?.name}`;
  
  const entityImage = project?.imageUrl || '/assets/user-circle.svg';
  const entityName = project?.company || employeeData?.name || '';
  const entityDescription = project?.initiative || (employeeData?.company || '');

  return (
    <div className="chat-page">
      <div className="top-bar-container">
        <TopBar title={chatTitle} />
      </div>
      <div className="chat-content">
        <button className="back-button" onClick={handleBackClick}>
          ← Back
        </button>
        
        <div className="chat-container">
          <div className="chat-header">
            <img 
              src={entityImage} 
              alt={entityName}
              className="chat-company-image"
            />
            <div className="chat-company-info">
              <h2 className="chat-company-name">{entityName}</h2>
              <p className="chat-initiative-name">{entityDescription}</p>
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