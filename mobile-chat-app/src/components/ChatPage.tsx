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

// Initiative details type
interface InitiativeDetail {
  company: string;
  challenge: string;
  description: string;
  imageUrl: string;
}

// Initiative map type
type InitiativeDetailsMap = {
  [initiative: string]: InitiativeDetail;
};

const ChatPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{sender: string, text: string, timestamp: Date}>>([]);
  const [project, setProject] = useState<ProjectData | null>(null);
  
  // Initiative details (same as in SwipeContainer)
  const initiativeDetails: InitiativeDetailsMap = {
    'Virgin Atlantic - Youngest, Cleanest Fleet in the Sky': {
      company: 'Virgin Atlantic',
      challenge: 'The time for action against climate change is now. Virgin Atlantic are on a mission to achieve net-zero by 2050.',
      description: 'Virgin Atlantic is working to accelerate the development of sustainable fuels. On November 28th, we made history with Flight100 becoming the first commercial airline to fly across the Atlantic on 100% SAF - marking a key milestone on the path to decarbonising aviation.',
      imageUrl: 'https://images.ctfassets.net/rxqefefl3t5b/3cNPacvs5XOn36kvDhDkXf/a9a46bd03c2e5b9da9c5398ae14eb34b/A350_Air2Air2019_Retouched_DSC4963_EM4.jpg?fl=progressive&q=80'
    },
    'Virgin Atlantic & Virgin Unite - Protecting our Planet': {
      company: 'Virgin Atlantic & Virgin Unite',
      challenge: 'Preserving our planet requires collaborative approaches to environmental conservation.',
      description: 'Virgin Atlantic and Virgin Unite are collaborating on comprehensive environmental initiatives aimed at protecting biodiversity and natural habitats while implementing sustainable practices throughout their operations.',
      imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Voyages - Epic Sea Change For All': {
      company: 'Virgin Voyages',
      challenge: 'Wildlife havens, carbon stores, storm defences, ocean purifiers - mangrove swamps are one of the hardest-working habitats on Earth, but they\'re disappearing fast.',
      description: 'Virgin Voyages have teamed up with Virgin\'s Foundation, Virgin Unite, to support mangrove forest projects in the Caribbean. The aim is to accelerate nature-based solutions to climate change, and create a scalable model for other regions in the world.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Media O2 - Better Connections Plan (Recycling)': {
      company: 'Virgin Media O2',
      challenge: 'Electronic waste is one of the fastest-growing waste streams globally, with significant environmental impacts.',
      description: 'Virgin Media O2\'s recycling initiative is tackling e-waste by implementing comprehensive recycling programs for electronic devices and accessories, reducing landfill waste and promoting circular economy principles.',
      imageUrl: 'https://images.unsplash.com/photo-1590219590780-f8cfab573cc1?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Media O2 - Better Connections Plan (Digital Divide)': {
      company: 'Virgin Media O2',
      challenge: 'The digital divide, or the split between those with and without reliable internet connectivity and related technologies, has profound implications on society.',
      description: 'Community Calling is a pioneering initiative by Virgin Media O2 and environmental charity Hubbub to tackle digital exclusion. It has already rehomed more than 20,000 unused smartphones with people who need them across the country.',
      imageUrl: 'https://images.unsplash.com/photo-1595392029731-a6a252df1fd1?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Media O2 - Better Connections Plan (Eco Rating)': {
      company: 'Virgin Media O2',
      challenge: 'Consumers often lack transparent information about the environmental impact of their technology choices.',
      description: 'The Eco Rating initiative provides clear information about the environmental impact of mobile devices, helping consumers make more sustainable choices and encouraging manufacturers to improve their practices.',
      imageUrl: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Media O2 - Better Connections Plan (Second-hand Devices)': {
      company: 'Virgin Media O2',
      challenge: 'The continuous cycle of new device purchases contributes significantly to electronic waste and resource depletion.',
      description: 'Virgin Media O2\'s second-hand device program extends the lifecycle of electronic devices, reducing waste and making technology more accessible while significantly reducing the carbon footprint associated with manufacturing new devices.',
      imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Limited Edition & Virgin Unite - Pride \'n Purpose': {
      company: 'Virgin Limited Edition & Virgin Unite',
      challenge: 'Many communities face socioeconomic challenges that require sustainable development approaches.',
      description: 'Pride \'n Purpose works with communities to develop sustainable livelihoods, addressing social inequities through education, healthcare, and entrepreneurial initiatives that empower local populations and create lasting positive change.',
      imageUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Limited Edition & Virgin Unite - Mahali Mzuri: Inua Jamii': {
      company: 'Virgin Limited Edition & Virgin Unite',
      challenge: 'Wildlife conservation efforts must balance ecological needs with the socioeconomic well-being of local communities.',
      description: 'Mahali Mzuri\'s Inua Jamii initiative promotes sustainable tourism practices while supporting wildlife conservation and community development, creating a model where tourism benefits both nature and local communities.',
      imageUrl: 'https://www.virginlimitededition.com/media/yakleqrf/mahali-mzuri-camp-and-guides-1.jpg?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Unite - Planetary Guardians': {
      company: 'Virgin Unite',
      challenge: 'The dual crises of climate change and mass wildlife extinctions threaten to forever change our world.',
      description: 'Planetary Guardians brings together global leaders and organizations to address climate change through collaborative efforts, driving innovation and policy changes that protect our planet\'s ecosystems and biodiversity.',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Unite - The Elders': {
      company: 'Virgin Unite',
      challenge: 'Complex global issues require experienced leadership and collaborative approaches.',
      description: 'The Elders brings together former heads of state, peace activists, and human rights advocates to promote peace, justice, and sustainable development through independent leadership and constructive dialogue.',
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Unite - Ocean Unite / ORRAA': {
      company: 'Virgin Unite',
      challenge: 'The dual crises of climate change and mass wildlife extinctions threaten to forever change our world.',
      description: 'Ocean Unite / ORRAA in collaboration with the Marine Conservation Institute and Oceans 5, brought together 30 of the largest NGOs from around the world, stimulating joint efforts towards the goal of strongly protecting at least 30% of the Ocean by 2030.',
      imageUrl: 'https://onlyone-cms.imgix.net/v1v8cy5da8fh/6ef2qr8mVLZwMpctd7jlY9/37858fc8bc929522620398e35d016b3f/Alpha-Universe-Photo-by-Sony-Artisan-of-Imagery-Andy-Mann-DSC08557-Edit.880074f1fd6d9422f6c3fded126a54c8.jpg?w=1920&auto=compress,format?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Unite - Community Mapathon: Humanitarian OpenStreetMap (HOT)': {
      company: 'Virgin Unite',
      challenge: 'Effective disaster response and climate change adaptation require accurate, up-to-date geographical information.',
      description: 'The Community Mapathon initiative uses open-source mapping to support humanitarian efforts, disaster relief, and climate change adaptation, building community resilience through improved geographical data and collaborative mapping.',
      imageUrl: 'https://images.ctfassets.net/rxqefefl3t5b/3K5qvqVy2RDMSapLI2yuaZ/79d2e16132d06d017b20e013ce47d643/Humanitarian_OpenStreetMap_Team_2.jpg?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Unite - Project CETI (Cetacean Translation Initiative)': {
      company: 'Virgin Unite',
      challenge: 'Humanity is facing the collapse of entire ecosystems, and the biodiversity of our planet is being eroded at unprecedented rates.',
      description: 'Project CETI uses machine learning and robotics to translate sperm whale clicks in Dominica. By shedding light on the intricate and intelligent communication of whales, the project not only aims to accelerate conservation efforts, but has the potential to transform the way we understand our relationship with the natural world.',
      imageUrl: 'https://cdn.prod.website-files.com/643ddd7ffdf12273933a8cec/66db26d5082b9717e2855981_male-and-female-whale-p-500.png?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Unite - Eve Branson Foundation': {
      company: 'Virgin Unite',
      challenge: 'Rural communities often lack access to education, healthcare, and sustainable economic opportunities.',
      description: 'The Eve Branson Foundation supports rural communities by providing education, healthcare, and sustainable livelihood opportunities, empowering local artisans and entrepreneurs while preserving cultural heritage.',
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=500&auto=format&fit=crop'
    },
    'Virgin Unite - Unite BVI': {
      company: 'Virgin Unite',
      challenge: 'Island communities face unique environmental and social challenges requiring sustainable development approaches.',
      description: 'Unite BVI works to create positive community and environmental impact in the British Virgin Islands through projects that support local entrepreneurs, conserve natural resources, and promote social equity.',
      imageUrl: 'https://images.ctfassets.net/zois51yf0qbx/1gd29y9PXUzXMFiUD6KzH6/531bdf4dc2df770b33ad004d3d6e604b/How_supports_us_piture_good_quality_cropped_for_website.jpg?q=80&w=500&auto=format&fit=crop'
    }
  };

  // List of all initiatives
  const initiatives = Object.keys(initiativeDetails);
  
  // Simulating fetching project data based on projectId parameter
  useEffect(() => {
    if (projectId) {
      const projectIdNum = parseInt(projectId);
      
      // If projectId is a valid number and within the initiatives array range
      if (!isNaN(projectIdNum) && projectIdNum >= 0 && projectIdNum < initiatives.length) {
        const initiativeName = initiatives[projectIdNum];
        const details = initiativeDetails[initiativeName];
        
        setProject({
          id: projectId,
          name: initiativeName,
          imageUrl: details.imageUrl,
          details: {
            company: details.company,
            challenge: details.challenge,
            description: details.description
          }
        });
      } else {
        // Fallback to default if projectId is not valid
        console.error(`Invalid project ID: ${projectId}`);
        setProject({
          id: projectId,
          name: "Initiative Not Found",
          imageUrl: "https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?q=80&w=500&auto=format&fit=crop",
          details: {
            company: "Virgin",
            challenge: "Initiative not found",
            description: "Please try another project."
          }
        });
      }
    }
  }, [projectId, initiatives]);
  
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