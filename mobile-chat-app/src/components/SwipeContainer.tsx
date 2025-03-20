import React, { useState, useEffect } from 'react';
import SwipeCard, { CardData } from './SwipeCard';
import './SwipeContainer.css';
import MatchedProjectsGrid from './MatchedProjectsGrid';
import { ProjectData } from '../types/projectTypes';

// Sample project data from Virgin StartHack CSV
const projectCards: CardData[] = [
  {
    id: '1',
    name: 'Youngest, Cleanest Fleet in the Sky',
    imageUrl: 'https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?q=80&w=500&auto=format&fit=crop',
    details: {
      company: 'Virgin Atlantic',
      challenge: 'The time for action against climate change is now. Virgin Atlantic are on a mission to achieve net-zero by 2050.',
      description: 'Virgin Atlantic is working to accelerate the development of sustainable fuels. On November 28th, we made history with Flight100 becoming the first commercial airline to fly across the Atlantic on 100% SAF - marking a key milestone on the path to decarbonising aviation.'
    }
  },
  {
    id: '2',
    name: 'Epic Sea Change For All',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop',
    details: {
      company: 'Virgin Voyages',
      challenge: 'Wildlife havens, carbon stores, storm defences, ocean purifiers - mangrove swamps are one of the hardest-working habitats on Earth, but they\'re disappearing fast.',
      description: 'Virgin Voyages have teamed up with Virgin\'s Foundation, Virgin Unite, to support mangrove forest projects in the Caribbean. The aim is to accelerate nature-based solutions to climate change, and create a scalable model for other regions in the world.'
    }
  },
  {
    id: '3',
    name: 'Better Connections Plan',
    imageUrl: 'https://images.unsplash.com/photo-1573375852883-abd12fcc7d07?q=80&w=500&auto=format&fit=crop',
    details: {
      company: 'Virgin Media 02',
      challenge: 'The digital divide, or the split between those with and without reliable internet connectivity and related technologies, has profound implications on society.',
      description: 'Community Calling is a pioneering initiative by Virgin Media O2 and environmental charity Hubbub to tackle digital exclusion. It has already rehomed more than 20,000 unused smartphones with people who need them across the country.'
    }
  },
  {
    id: '4',
    name: 'Project CETI',
    imageUrl: 'https://images.unsplash.com/photo-1569428034239-f9565e32e224?q=80&w=500&auto=format&fit=crop',
    details: {
      company: 'Virgin Unite',
      challenge: 'Humanity is facing the collapse of entire ecosystems, and the biodiversity of our planet is being eroded at unprecedented rates.',
      description: 'Project CETI uses machine learning and robotics to translate sperm whale clicks in Dominica. By shedding light on the intricate and intelligent communication of whales, the project not only aims to accelerate conservation efforts, but has the potential to transform the way we understand our relationship with the natural world.'
    }
  },
  {
    id: '5',
    name: 'Ocean Unite / ORRAA',
    imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=500&auto=format&fit=crop',
    details: {
      company: 'Virgin Unite',
      challenge: 'The dual crises of climate change and mass wildlife extinctions threaten to forever change our world.',
      description: 'Ocean Unite / ORRAA in collaboration with the Marine Conservation Institute and Oceans 5, brought together 30 of the largest NGOs from around the world, stimulating joint efforts towards the goal of strongly protecting at least 30% of the Ocean by 2030.'
    }
  },
];

// Convert CardData to ProjectData for the matched projects grid
const convertToProjectData = (card: CardData): ProjectData => {
  return {
    id: card.id,
    company: card.details?.company || '',
    initiative: card.name,
    challenge: card.details?.challenge || '',
    description: card.details?.description,
    imageUrl: card.imageUrl
  };
};

interface Choice {
  cardId: string;
  liked: boolean;
  timestamp: number;
}

const SwipeContainer: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [completed, setCompleted] = useState(false);
  const [matchedProjects, setMatchedProjects] = useState<ProjectData[]>([]);

  // Load viewed cards from localStorage
  useEffect(() => {
    try {
      const savedChoices = localStorage.getItem('project-swipe-choices');
      const savedSkipped = localStorage.getItem('project-swipe-skipped');
      
      let viewedCardIds: string[] = [];
      
      if (savedChoices) {
        const parsedChoices = JSON.parse(savedChoices);
        if (Array.isArray(parsedChoices)) {
          setChoices(parsedChoices);
          viewedCardIds = parsedChoices.map(choice => choice.cardId);
        }
      }
      
      if (savedSkipped === 'true') {
        // If user previously skipped, don't show cards
        setCompleted(true);
        return;
      }
      
      // Filter out cards that have already been viewed
      const remainingCards = projectCards.filter(card => !viewedCardIds.includes(card.id));
      
      if (remainingCards.length === 0) {
        setCompleted(true);
        // Calculate matched projects
        findMatchedProjects();
      } else {
        setCards(remainingCards);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setCards(projectCards);
    }
  }, []);

  const handleLike = () => {
    if (currentCardIndex >= cards.length) return;
    
    const currentCard = cards[currentCardIndex];
    const newChoice: Choice = {
      cardId: currentCard.id,
      liked: true,
      timestamp: Date.now()
    };
    
    const newChoices = [...choices, newChoice];
    setChoices(newChoices);
    localStorage.setItem('project-swipe-choices', JSON.stringify(newChoices));
    
    goToNextCard();
  };

  const handleDislike = () => {
    if (currentCardIndex >= cards.length) return;
    
    const currentCard = cards[currentCardIndex];
    const newChoice: Choice = {
      cardId: currentCard.id,
      liked: false,
      timestamp: Date.now()
    };
    
    const newChoices = [...choices, newChoice];
    setChoices(newChoices);
    localStorage.setItem('project-swipe-choices', JSON.stringify(newChoices));
    
    goToNextCard();
  };

  const handleSkip = () => {
    localStorage.setItem('project-swipe-skipped', 'true');
    setCompleted(true);
  };

  const goToNextCard = () => {
    const nextIndex = currentCardIndex + 1;
    setCurrentCardIndex(nextIndex);
    
    if (nextIndex >= cards.length) {
      setCompleted(true);
      findMatchedProjects();
    }
  };

  const findMatchedProjects = () => {
    // Find all liked projects
    const likedChoices = choices.filter(choice => choice.liked);
    
    // Map to project cards
    const likedProjects = likedChoices.map(choice => {
      return projectCards.find(card => card.id === choice.cardId);
    }).filter(card => card !== undefined) as CardData[];
    
    // Convert to ProjectData format for the matched projects grid
    const matchedProjectsData = likedProjects.map(card => convertToProjectData(card));
    
    setMatchedProjects(matchedProjectsData);
  };

  const resetChoices = () => {
    localStorage.removeItem('project-swipe-choices');
    localStorage.removeItem('project-swipe-skipped');
    setChoices([]);
    setCurrentCardIndex(0);
    setCompleted(false);
    setMatchedProjects([]);
    setCards(projectCards);
  };

  if (completed) {
    return (
      <div className="swipe-container">
        <div className="results-container">
          <h2>Your Matched Projects</h2>
          <p>Based on your preferences, here are the projects that might interest you:</p>
          
          {matchedProjects.length > 0 ? (
            <MatchedProjectsGrid projects={matchedProjects} />
          ) : (
            <p className="no-matches">No matched projects found. Try again with different preferences.</p>
          )}
          
          <button className="reset-button" onClick={resetChoices}>
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="swipe-container">
        <div className="swipe-loading">Loading...</div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="swipe-container">
      <SwipeCard 
        card={currentCard} 
        onLike={handleLike} 
        onDislike={handleDislike}
      />
      <div className="swipe-actions">
        <button className="action-button dislike-button" onClick={handleDislike}>
          <span className="action-icon">✕</span>
        </button>
        <button className="action-button skip-button" onClick={handleSkip}>
          Skip
        </button>
        <button className="action-button like-button" onClick={handleLike}>
          <span className="action-icon">♥</span>
        </button>
      </div>
    </div>
  );
};

export default SwipeContainer; 