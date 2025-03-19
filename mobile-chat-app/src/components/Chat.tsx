import React, { useState, useEffect, useRef, FC } from 'react';
import './Chat.css';

interface Message {
  id: string;
  text: string;
  timestamp: number;
}

interface ChatProps {
  storageKey?: string;
}

const Chat: FC<ChatProps> = ({ storageKey = 'chat-messages-mobile' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(storageKey);
      console.log('Loading messages from localStorage:', savedMessages);
      
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
    }
  }, [storageKey]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      console.log('Saving messages to localStorage:', messages);
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages, storageKey]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: Date.now(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message-bubble">
            <div className="message-text">{message.text}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
      </form>
    </div>
  );
};

export default Chat; 