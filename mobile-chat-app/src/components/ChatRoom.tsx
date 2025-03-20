import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ChatRoom.css';

interface Message {
  id: string;
  text: string;
  sender: string;
  senderAvatar: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

const ChatRoom = (): React.ReactElement => {
  const navigate = useNavigate();
  const { discussionId } = useParams<{ discussionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [discussionDetails, setDiscussionDetails] = useState({
    title: '',
    starter: '',
    starterAvatar: '',
    startDate: '',
    replies: 0,
    likes: 0
  });
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch discussion details and messages
    // This would normally come from an API
    fetchDiscussionDetails();
    fetchMessages();
  }, [discussionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDiscussionDetails = () => {
    // Mock data - in a real app, this would come from an API
    const discussions = [
      { 
        id: '1', 
        title: 'Ideas for reducing plastic waste', 
        starter: 'Sarah Green',
        starterAvatar: 'SG',
        startDate: '2 days ago',
        replies: 24,
        likes: 38
      },
      { 
        id: '2', 
        title: 'Virgin Atlantic\'s SAF initiative discussion', 
        starter: 'John Reese',
        starterAvatar: 'JR',
        startDate: '5 days ago',
        replies: 18,
        likes: 29
      },
      { 
        id: '3', 
        title: 'Community clean-up event planning', 
        starter: 'Alice Garcia',
        starterAvatar: 'AG',
        startDate: '1 week ago',
        replies: 42,
        likes: 56
      }
    ];

    const discussion = discussions.find(d => d.id === discussionId) || discussions[0];
    setDiscussionDetails(discussion);
  };

  const fetchMessages = () => {
    // Mock data - in a real app, this would come from an API
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hey everyone, I wanted to start a discussion about how we can reduce plastic waste in our daily lives.',
        sender: discussionId === '1' ? 'Sarah Green' : discussionId === '2' ? 'John Reese' : 'Alice Garcia',
        senderAvatar: discussionId === '1' ? 'SG' : discussionId === '2' ? 'JR' : 'AG',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        isCurrentUser: false
      },
      {
        id: '2',
        text: `I've been using reusable water bottles and shopping bags for a while now. It's a small change but makes a big difference!`,
        sender: 'Michael Brown',
        senderAvatar: 'MB',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isCurrentUser: false
      },
      {
        id: '3',
        text: `I've also found some great plastic-free alternatives for household products. Would anyone be interested in a list?`,
        sender: 'Emma Wilson',
        senderAvatar: 'EW',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        isCurrentUser: false
      },
      {
        id: '4',
        text: `Yes, I'd love to see that list Emma! I'm trying to reduce my household plastic waste too.`,
        sender: 'You',
        senderAvatar: 'ME',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        isCurrentUser: true
      },
      {
        id: '5',
        text: 'Has anyone tried those shampoo bars instead of bottles? Do they work well?',
        sender: 'You',
        senderAvatar: 'ME',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        isCurrentUser: true
      },
      {
        id: '6',
        text: `I've been using shampoo bars for about 6 months now and they're great! They last longer than bottled shampoo too.`,
        sender: 'David Chen',
        senderAvatar: 'DC',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isCurrentUser: false
      }
    ];

    setMessages(mockMessages);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'You',
      senderAvatar: 'ME',
      timestamp: new Date(),
      isCurrentUser: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBack = () => {
    // Navigate to the root page with community tab active
    navigate('/?tab=community');
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="chatroom-info">
          <h2>{discussionDetails.title}</h2>
          <p>Started by {discussionDetails.starter} • {discussionDetails.startDate}</p>
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.isCurrentUser ? 'current-user' : ''}`}>
            <div className="message-avatar">{message.senderAvatar}</div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">{message.sender}</span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatRoom; 