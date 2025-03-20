import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeCard, { CardData } from './SwipeCard';
import './SwipeContainer.css';
import ResultsCard from './ResultsCard';

// Extend the CardData interface to include matchedTopics
interface ExtendedCardData extends CardData {
  matchedTopics?: string[];
  liked?: boolean;
}

// Define types for initiative mapping
type InitiativeTopicsMap = {
  [initiative: string]: string[];
};

// Define types for initiative details
interface InitiativeDetail {
  company: string;
  challenge: string;
  description: string;
  imageUrl: string;
}

type InitiativeDetailsMap = {
  [initiative: string]: InitiativeDetail;
};

// Define types for topic images
type TopicImageMap = {
  [topic: string]: string;
};

// Data mapping topics to initiatives
const initiativeMap: InitiativeTopicsMap = {
  'Virgin Atlantic - Youngest, Cleanest Fleet in the Sky': [
    'Climate Change Mitigation',
    'Sustainable Aviation',
    'Innovation in Renewable Energy'
  ],
  'Virgin Atlantic & Virgin Unite - Protecting our Planet': [
    'Climate Change Mitigation',
    'Environmental Conservation',
    'Collaborative Global Efforts'
  ],
  'Virgin Voyages - Epic Sea Change For All': [
    'Marine Conservation',
    'Climate Change Mitigation',
    'Community Engagement'
  ],
  'Virgin Media O2 - Better Connections Plan (Recycling)': [
    'E-waste Reduction',
    'Sustainable Consumption',
    'Circular Economy'
  ],
  'Virgin Media O2 - Better Connections Plan (Digital Divide)': [
    'Digital Inclusion',
    'Social Equity',
    'Community Support'
  ],
  'Virgin Media O2 - Better Connections Plan (Eco Rating)': [
    'Sustainable Technology',
    'Consumer Awareness',
    'Environmental Impact Reduction'
  ],
  'Virgin Media O2 - Better Connections Plan (Second-hand Devices)': [
    'Sustainable Consumption',
    'E-waste Reduction',
    'Carbon Footprint Reduction'
  ],
  'Virgin Limited Edition & Virgin Unite - Pride \'n Purpose': [
    'Community Development',
    'Sustainable Livelihoods',
    'Social Equity'
  ],
  'Virgin Limited Edition & Virgin Unite - Mahali Mzuri: Inua Jamii': [
    'Wildlife Conservation',
    'Community Development',
    'Sustainable Tourism'
  ],
  'Virgin Unite - Planetary Guardians': [
    'Climate Change Mitigation',
    'Environmental Conservation',
    'Global Collaboration'
  ],
  'Virgin Unite - The Elders': [
    'Global Leadership',
    'Peace and Justice',
    'Sustainable Development'
  ],
  'Virgin Unite - Ocean Unite / ORRAA': [
    'Marine Conservation',
    'Climate Change Mitigation',
    'Global Collaboration'
  ],
  'Virgin Unite - Community Mapathon: Humanitarian OpenStreetMap (HOT)': [
    'Disaster Relief',
    'Climate Change Adaptation',
    'Community Support'
  ],
  'Virgin Unite - Project CETI (Cetacean Translation Initiative)': [
    'Marine Conservation',
    'Biodiversity Preservation',
    'Technological Innovation'
  ],
  'Virgin Unite - Eve Branson Foundation': [
    'Community Development',
    'Education and Healthcare',
    'Sustainable Livelihoods'
  ],
  'Virgin Unite - Unite BVI': [
    'Community Development',
    'Environmental Conservation',
    'Social Equity'
  ]
};

// Definition of initiative details
const initiativeDetails: InitiativeDetailsMap = {
  'Virgin Atlantic - Youngest, Cleanest Fleet in the Sky': {
    company: 'Virgin Atlantic',
    challenge: 'The time for action against climate change is now. Virgin Atlantic are on a mission to achieve net-zero by 2050.',
    description: 'Virgin Atlantic is working to accelerate the development of sustainable fuels. On November 28th, we made history with Flight100 becoming the first commercial airline to fly across the Atlantic on 100% SAF - marking a key milestone on the path to decarbonising aviation.',
    imageUrl: 'https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?q=80&w=500&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Media O2 - Better Connections Plan (Digital Divide)': {
    company: 'Virgin Media O2',
    challenge: 'The digital divide, or the split between those with and without reliable internet connectivity and related technologies, has profound implications on society.',
    description: 'Community Calling is a pioneering initiative by Virgin Media O2 and environmental charity Hubbub to tackle digital exclusion. It has already rehomed more than 20,000 unused smartphones with people who need them across the country.',
    imageUrl: 'https://images.unsplash.com/photo-1573375852883-abd12fcc7d07?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Media O2 - Better Connections Plan (Eco Rating)': {
    company: 'Virgin Media O2',
    challenge: 'Consumers often lack transparent information about the environmental impact of their technology choices.',
    description: 'The Eco Rating initiative provides clear information about the environmental impact of mobile devices, helping consumers make more sustainable choices and encouraging manufacturers to improve their practices.',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Media O2 - Better Connections Plan (Second-hand Devices)': {
    company: 'Virgin Media O2',
    challenge: 'The continuous cycle of new device purchases contributes significantly to electronic waste and resource depletion.',
    description: 'Virgin Media O2\'s second-hand device program extends the lifecycle of electronic devices, reducing waste and making technology more accessible while significantly reducing the carbon footprint associated with manufacturing new devices.',
    imageUrl: 'https://images.unsplash.com/photo-1581993192804-90ce8a0f7a7b?q=80&w=500&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=500&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Unite - Community Mapathon: Humanitarian OpenStreetMap (HOT)': {
    company: 'Virgin Unite',
    challenge: 'Effective disaster response and climate change adaptation require accurate, up-to-date geographical information.',
    description: 'The Community Mapathon initiative uses open-source mapping to support humanitarian efforts, disaster relief, and climate change adaptation, building community resilience through improved geographical data and collaborative mapping.',
    imageUrl: 'https://images.unsplash.com/photo-1498354178607-a79df2916198?q=80&w=500&auto=format&fit=crop'
  },
  'Virgin Unite - Project CETI (Cetacean Translation Initiative)': {
    company: 'Virgin Unite',
    challenge: 'Humanity is facing the collapse of entire ecosystems, and the biodiversity of our planet is being eroded at unprecedented rates.',
    description: 'Project CETI uses machine learning and robotics to translate sperm whale clicks in Dominica. By shedding light on the intricate and intelligent communication of whales, the project not only aims to accelerate conservation efforts, but has the potential to transform the way we understand our relationship with the natural world.',
    imageUrl: 'https://images.unsplash.com/photo-1569428034239-f9565e32e224?q=80&w=500&auto=format&fit=crop'
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
    imageUrl: 'https://images.unsplash.com/photo-1516091877740-fde016699f2c?q=80&w=500&auto=format&fit=crop'
  }
};

// Create interest topic cards
const interestTopics = [
  'Climate Change Mitigation',
  'Sustainable Aviation',
  'Innovation in Renewable Energy',
  'Environmental Conservation',
  'Collaborative Global Efforts',
  'Marine Conservation',
  'Community Engagement',
  'E-waste Reduction',
  'Sustainable Consumption',
  'Circular Economy',
  'Digital Inclusion',
  'Social Equity',
  'Community Support',
  'Sustainable Technology',
  'Consumer Awareness',
  'Environmental Impact Reduction',
  'Carbon Footprint Reduction',
  'Community Development',
  'Sustainable Livelihoods',
  'Wildlife Conservation',
  'Sustainable Tourism',
  'Global Collaboration',
  'Global Leadership',
  'Peace and Justice',
  'Sustainable Development',
  'Disaster Relief',
  'Climate Change Adaptation',
  'Biodiversity Preservation',
  'Technological Innovation',
  'Education and Healthcare'
];

// Map topics to image URLs for visualization
const topicImages: TopicImageMap = {
  'Climate Change Mitigation': 'https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?q=80&w=500&auto=format&fit=crop',
  'Sustainable Aviation': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=500&auto=format&fit=crop',
  'Innovation in Renewable Energy': 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=500&auto=format&fit=crop',
  'Environmental Conservation': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=500&auto=format&fit=crop',
  'Collaborative Global Efforts': 'https://images.unsplash.com/photo-1556484687-30636164638b?q=80&w=500&auto=format&fit=crop',
  'Marine Conservation': 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=500&auto=format&fit=crop',
  'Community Engagement': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=500&auto=format&fit=crop',
  'E-waste Reduction': 'https://images.unsplash.com/photo-1605600659873-d808a13e4e2c?q=80&w=500&auto=format&fit=crop',
  'Sustainable Consumption': 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=500&auto=format&fit=crop',
  'Circular Economy': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=500&auto=format&fit=crop',
  'Digital Inclusion': 'https://images.unsplash.com/photo-1548092372-0d1bd40894a3?q=80&w=500&auto=format&fit=crop',
  'Social Equity': 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=500&auto=format&fit=crop',
  'Community Support': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=500&auto=format&fit=crop',
  'Sustainable Technology': 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=500&auto=format&fit=crop',
  'Consumer Awareness': 'https://images.unsplash.com/photo-1464380573004-8ca85a08751a?q=80&w=500&auto=format&fit=crop',
  'Environmental Impact Reduction': 'https://images.unsplash.com/photo-1516222338250-2ae08b641079?q=80&w=500&auto=format&fit=crop',
  'Carbon Footprint Reduction': 'https://images.unsplash.com/photo-1545281340-85d885034144?q=80&w=500&auto=format&fit=crop',
  'Community Development': 'https://images.unsplash.com/photo-1526958097901-5e6d742d3371?q=80&w=500&auto=format&fit=crop',
  'Sustainable Livelihoods': 'https://images.unsplash.com/photo-1557495235-340eb888a9fb?q=80&w=500&auto=format&fit=crop',
  'Wildlife Conservation': 'https://images.unsplash.com/photo-1566159266259-c65d47d1f1e6?q=80&w=500&auto=format&fit=crop',
  'Sustainable Tourism': 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=500&auto=format&fit=crop',
  'Global Collaboration': 'https://images.unsplash.com/photo-1525013066836-c6090f0ad9d8?q=80&w=500&auto=format&fit=crop',
  'Global Leadership': 'https://images.unsplash.com/photo-1519834883885-44a2c86f0c2c?q=80&w=500&auto=format&fit=crop',
  'Peace and Justice': 'https://images.unsplash.com/photo-1447684808650-354ae64db5b8?q=80&w=500&auto=format&fit=crop',
  'Sustainable Development': 'https://images.unsplash.com/photo-1603921326210-6edd2eb3e8e4?q=80&w=500&auto=format&fit=crop',
  'Disaster Relief': 'https://images.unsplash.com/photo-1590097610464-a349d019a89c?q=80&w=500&auto=format&fit=crop',
  'Climate Change Adaptation': 'https://images.unsplash.com/photo-1598975824812-8d19965dad6a?q=80&w=500&auto=format&fit=crop',
  'Biodiversity Preservation': 'https://images.unsplash.com/photo-1594217090191-0ae8766c38cc?q=80&w=500&auto=format&fit=crop',
  'Technological Innovation': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop',
  'Education and Healthcare': 'https://images.unsplash.com/photo-1584351583369-6baf55aaf02f?q=80&w=500&auto=format&fit=crop'
};

// Create topic cards for the swipe interface
const getRandomTopicCards = (): CardData[] => {
  // Shuffle the topics array
  const shuffledTopics = [...interestTopics].sort(() => 0.5 - Math.random());
  
  // Take only 10 random topics
  const selectedTopics = shuffledTopics.slice(0, 10);
  
  // Create cards for the selected topics
  return selectedTopics.map((topic, index) => ({
    id: (index + 1).toString(),
    name: topic,
    imageUrl: topicImages[topic] || 'https://images.unsplash.com/photo-1624138784192-88cee49d64af?q=80&w=500&auto=format&fit=crop',
    details: {
      company: 'Sustainability Interest',
      challenge: 'Are you interested in this sustainability topic?',
      description: `Swipe right if you're interested in ${topic}, or left if you're not.`
    }
  }));
};

// Generate random topic cards
const topicCards: CardData[] = getRandomTopicCards();

interface Choice {
  cardId: string;
  liked: boolean;
  timestamp: number;
}

const SwipeContainer: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [completed, setCompleted] = useState(false);
  const [topMatches, setTopMatches] = useState<any[]>([]);
  const [likedTopics, setLikedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('projects');
  const [userPoints, setUserPoints] = useState(750); // Total sustainability points for the user
  const [nextBadge, setNextBadge] = useState({ name: 'Eco Champion', progress: 70, remaining: 250 });
  const [viewedCards, setViewedCards] = useState<ExtendedCardData[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load viewed cards from localStorage
  useEffect(() => {
    try {
      const savedChoices = localStorage.getItem('topic-swipe-choices');
      const savedSkipped = localStorage.getItem('topic-swipe-skipped');
      const completedSwipe = localStorage.getItem('swipe-completed');
      
      // Check if user has already completed swiping
      if (savedSkipped === 'true' || completedSwipe === 'true') {
        setCompleted(true);
        // Ensure matches are loaded
        findTopMatches();
        return;
      }
      
      let viewedCardIds: string[] = [];
      
      if (savedChoices) {
        const parsedChoices = JSON.parse(savedChoices);
        if (Array.isArray(parsedChoices)) {
          setChoices(parsedChoices);
          viewedCardIds = parsedChoices.map(choice => choice.cardId);
        }
      }
      
      // Generate fresh random topic cards for this session
      const currentTopicCards = getRandomTopicCards();
      
      // Filter out cards that have already been viewed
      // Note: since topics are random each time, viewedCardIds may not match exactly
      // This is intentional - we want new topics each time the app is loaded
      const remainingCards = currentTopicCards.filter(card => !viewedCardIds.includes(card.id));
      
      if (remainingCards.length === 0) {
        setCompleted(true);
        // Calculate matched projects
        findTopMatches();
      } else {
        setCards(remainingCards);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // If there's an error, just load a fresh set of random topics
      setCards(getRandomTopicCards());
    }
  }, []);

  const handleLike = () => {
    // No points awarded during preference swiping phase
    // This is just to determine user interests
    
    // Original functionality
    const extendedCard = currentCard as ExtendedCardData;
    const currentTopics = extendedCard.matchedTopics || [];
    setLikedTopics([...likedTopics, ...currentTopics]);
    setViewedCards([...viewedCards, { ...extendedCard, liked: true }]);
    
    // If there are more cards, go to the next one
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCompleted(true);
      localStorage.setItem('swipe-completed', 'true');
      findTopMatches(); // Ensure matches are calculated
    }
  };

  const handleDislike = () => {
    // No points awarded during preference swiping phase
    // This is just to determine user interests
    
    // Original functionality
    const extendedCard = currentCard as ExtendedCardData;
    setViewedCards([...viewedCards, { ...extendedCard, liked: false }]);
    
    // If there are more cards, go to the next one
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCompleted(true);
      localStorage.setItem('swipe-completed', 'true');
      findTopMatches(); // Ensure matches are calculated
    }
  };

  const handleSkip = () => {
    localStorage.setItem('topic-swipe-skipped', 'true');
    setCompleted(true);
  };

  const goToNextCard = () => {
    const nextIndex = currentCardIndex + 1;
    setCurrentCardIndex(nextIndex);
    
    if (nextIndex >= cards.length) {
      setCompleted(true);
      findTopMatches();
    }
  };

  const findTopMatches = () => {
    // First check if we have saved matches in localStorage
    const savedMatches = localStorage.getItem('matched-projects');
    if (savedMatches) {
      try {
        const parsedMatches = JSON.parse(savedMatches);
        setTopMatches(parsedMatches);
        return;
      } catch (error) {
        console.error('Error loading saved matches:', error);
      }
    }

    // If no saved matches or error loading them, proceed with calculation
    // Find all liked topics
    const likedChoices = choices.filter(choice => choice.liked);
    
    // Map to topic names using the entire interestTopics array
    // This ensures we can find the names even if the cards have changed
    const likedTopics = likedChoices.map(choice => {
      // For each liked choice, find the corresponding topic
      const cardId = parseInt(choice.cardId);
      const card = cards.find(c => c.id === choice.cardId);
      return card ? card.name : null;
    }).filter(name => name !== null) as string[];
    
    // Update the likedTopics state for the results view
    setLikedTopics(likedTopics);
    
    // If no interests were selected, show a default set
    if (likedTopics.length === 0) {
      // Get all initiative keys
      const allInitiatives = Object.keys(initiativeMap);
      
      // Shuffle them
      const shuffledInitiatives = [...allInitiatives].sort(() => 0.5 - Math.random());
      
      // Take 3 random initiatives
      const randomInitiatives = shuffledInitiatives.slice(0, 3);
      
      const defaultMatches = randomInitiatives.map(initiative => ({
        initiative: initiative,
        matchScore: 0,
        details: initiativeDetails[initiative],
        matchedTopics: []
      }));
      
      setTopMatches(defaultMatches);
      localStorage.setItem('matched-projects', JSON.stringify(defaultMatches));
      return;
    }
    
    // Calculate matches for each initiative
    const initiativeMatches = Object.keys(initiativeMap).map(initiative => {
      const initiativeTopics = initiativeMap[initiative];
      
      // Count how many of the user's liked topics match this initiative
      const matchedTopics = initiativeTopics.filter(topic => likedTopics.includes(topic));
      const matchScore = matchedTopics.length / initiativeTopics.length; // Score based on % match
      
      return {
        initiative,
        matchScore,
        details: initiativeDetails[initiative],
        matchedTopics
      };
    });
    
    // Sort by match score (highest first)
    const sortedMatches = initiativeMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .filter(match => match.matchScore > 0);
    
    // Take top 3 matches
    const top3Matches = sortedMatches.slice(0, 3);
    
    // If we have fewer than 3 matches, add random initiatives to reach 3
    let finalMatches = [...top3Matches];
    
    if (finalMatches.length < 3) {
      const unmatchedInitiatives = Object.keys(initiativeMap)
        .filter(initiative => !finalMatches.some(match => match.initiative === initiative));
      
      // Shuffle unmatched initiatives
      const shuffled = unmatchedInitiatives.sort(() => 0.5 - Math.random());
      
      // Add random initiatives until we have 3
      for (const initiative of shuffled) {
        if (finalMatches.length >= 3) break;
        
        finalMatches.push({
          initiative,
          matchScore: 0,
          details: initiativeDetails[initiative],
          matchedTopics: []
        });
      }
    }
    
    setTopMatches(finalMatches);
    localStorage.setItem('matched-projects', JSON.stringify(finalMatches));
  };

  const resetChoices = () => {
    localStorage.removeItem('topic-swipe-choices');
    localStorage.removeItem('topic-swipe-skipped');
    localStorage.removeItem('matched-projects'); // Clear saved matches
    setChoices([]);
    setCurrentCardIndex(0);
    setCompleted(false);
    setTopMatches([]);
    setLikedTopics([]);
    
    // Generate a new set of random topic cards
    const newRandomTopics = getRandomTopicCards();
    setCards(newRandomTopics);
  };

  const handleChatClick = (projectId: string) => {
    // Make sure we save the completed state to localStorage before navigating
    localStorage.setItem('swipe-completed', 'true');
    
    // Add points for engaging with chat - this is a meaningful interaction
    setUserPoints(prevPoints => prevPoints + 15);
    updateNextBadgeProgress();
    
    // Navigate to the chat page
    navigate(`/chat/${projectId}`);
  };

  const updateNextBadgeProgress = () => {
    // Update progress towards next badge
    const newRemaining = Math.max(0, nextBadge.remaining - 10);
    const newProgress = Math.min(100, nextBadge.progress + (10 * 100) / (nextBadge.remaining + nextBadge.progress * 10));
    
    setNextBadge(prev => ({
      ...prev,
      remaining: newRemaining,
      progress: newProgress
    }));
    
    // If reached 100%, could trigger badge award notification
    if (newProgress >= 100) {
      alert(`Congratulations! You've earned the ${nextBadge.name} badge!`);
      // Here you would normally update the user's badge collection and set a new next badge
    }
  };

  if (completed) {
    const displayCards = localStorage.getItem('topic-swipe-skipped') === 'true' 
      ? Object.keys(initiativeMap).map((initiative, index) => ({
          initiative,
          matchScore: 0,
          details: initiativeDetails[initiative],
          matchedTopics: []
        }))
      : topMatches;

    const filteredCards = displayCards.filter(card => {
      const searchLower = searchQuery.toLowerCase();
      return (
        card.initiative.toLowerCase().includes(searchLower) ||
        card.details.company.toLowerCase().includes(searchLower) ||
        card.details.challenge.toLowerCase().includes(searchLower) ||
        card.details.description.toLowerCase().includes(searchLower) ||
        card.matchedTopics.some((topic: string) => topic.toLowerCase().includes(searchLower))
      );
    });

    return (
      <div className="swipe-container">
        <div className="results-container">
          <div className="results-nav">
            <button 
              className={`nav-button ${activeNav === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveNav('projects')}
            >
              Projects
            </button>
            <button 
              className={`nav-button ${activeNav === 'badges' ? 'active' : ''}`}
              onClick={() => setActiveNav('badges')}
            >
              My Badges
            </button>
            <button 
              className={`nav-button ${activeNav === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveNav('leaderboard')}
            >
              Leaderboard
            </button>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search initiatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          {activeNav === 'projects' && (
            <>
              {likedTopics && likedTopics.length === 0 ? (
                <>
                  <h2>Discover Virgin Initiatives</h2>
                  <p>Here are some initiatives that might interest you:</p>
                </>
              ) : (
                <>
                  <h2>Your Top Initiative Matches</h2>
                  <p>Based on your interests, these Virgin initiatives align with your values:</p>
                </>
              )}
              
              <div className="results-grid">
                {filteredCards.map((match, index) => (
                  <div key={match.initiative} className="swipe-match-result">
                    <ResultsCard 
                      project={{
                        id: index.toString(),
                        name: match.initiative,
                        imageUrl: match.details.imageUrl,
                        details: {
                          company: match.details.company,
                          challenge: match.details.challenge,
                          description: match.details.description
                        }
                      }} 
                      rank={index + 1} 
                      onChatClick={handleChatClick}
                      matchedInterests={match.matchedTopics}
                    />
                  </div>
                ))}
              </div>
              
              {filteredCards.length === 0 && (
                <div className="no-results">
                  No initiatives found matching your search.
                </div>
              )}
              
              {likedTopics && likedTopics.length === 0 && (
                <div className="discovery-hint">
                  Try again to find initiatives that match your specific interests!
                </div>
              )}
              
              <button className="reset-button" onClick={resetChoices}>
                Start Over
              </button>
            </>
          )}
          
          {activeNav === 'badges' && (
            <div className="badges-container">
              <h2>My Sustainability Badges</h2>
              <p>Track your achievements and impact on sustainability initiatives.</p>
              
              <div className="user-total-points">
                <div className="total-points-value">{userPoints}</div>
                <div className="total-points-label">Total Sustainability Points</div>
              </div>
              
              <div className="stats-container">
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Projects Joined</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Interests Matched</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">2</div>
                  <div className="stat-label">Badges Earned</div>
                </div>
              </div>

              <div className="next-milestone">
                <div className="next-milestone-title">Next Badge: {nextBadge.name}</div>
                <div className="milestone-progress-bar">
                  <div className="milestone-progress-fill" style={{ width: `${nextBadge.progress}%` }}></div>
                </div>
                <div className="milestone-remaining">{nextBadge.remaining} more points needed</div>
              </div>

              <div className="badges-section">
                <h3>Earned Badges</h3>
                <div className="badges-grid">
                  <div className="badge-item">
                    <div className="badge-icon earned">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"></path>
                        <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Early Adopter</div>
                    <div className="badge-description">Joined the sustainability initiative</div>
                  </div>
                  
                  <div className="badge-item">
                    <div className="badge-icon earned">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Climate Defender</div>
                    <div className="badge-description">Supported climate initiatives</div>
                  </div>
                </div>
              </div>
              
              <div className="badges-section">
                <h3>Locked Badges</h3>
                <div className="badges-grid">
                  <div className="badge-item">
                    <div className="badge-icon locked">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 17.2a6 6 0 0 0 8 0"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <div className="badge-name">Community Champion</div>
                    <div className="badge-description">Engage with 5 community projects</div>
                  </div>
                  
                  <div className="badge-item">
                    <div className="badge-icon locked">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12h6"></path>
                        <path d="M22 12h-6"></path>
                        <path d="M12 2v6"></path>
                        <path d="M12 22v-6"></path>
                        <path d="m17 3-5 5-5-5"></path>
                        <path d="m17 21-5-5-5 5"></path>
                        <path d="m3 17 5-5-5-5"></path>
                        <path d="m21 17-5-5 5-5"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Ocean Guardian</div>
                    <div className="badge-description">Support marine conservation</div>
                  </div>
                  
                  <div className="badge-item">
                    <div className="badge-icon locked">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v5"></path>
                        <path d="M9 12h6"></path>
                        <path d="M12 22v-6"></path>
                        <path d="M8 22h8"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Eco Innovator</div>
                    <div className="badge-description">Engage with technology initiatives</div>
                  </div>
                  
                  <div className="badge-item">
                    <div className="badge-icon locked">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                    </div>
                    <div className="badge-name">Consistency Master</div>
                    <div className="badge-description">Join for 30 consecutive days</div>
                  </div>
                </div>
              </div>
              
            </div>
          )}
          
          {activeNav === 'leaderboard' && (
            <div className="leaderboard-container">
              <h2>Sustainability Leaderboard</h2>
              <p>See how your sustainability efforts compare to others.</p>
              
              <div className="leaderboard-list">
                <div className="leaderboard-item">
                  <div className="leaderboard-rank">1</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">JD</div>
                    <div className="user-info">
                      <div className="user-name">Jane Doe</div>
                      <div className="user-badges">8 badges • 5 projects</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">1240</div>
                </div>
                
                <div className="leaderboard-item">
                  <div className="leaderboard-rank">2</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">MS</div>
                    <div className="user-info">
                      <div className="user-name">Mike Smith</div>
                      <div className="user-badges">6 badges • 4 projects</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">980</div>
                </div>
                
                <div className="leaderboard-item current-user">
                  <div className="leaderboard-rank">3</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">ME</div>
                    <div className="user-info">
                      <div className="user-name">You</div>
                      <div className="user-badges">2 badges • 3 projects</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">750</div>
                </div>
                
                <div className="leaderboard-item">
                  <div className="leaderboard-rank">4</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">TK</div>
                    <div className="user-info">
                      <div className="user-name">Taylor Kim</div>
                      <div className="user-badges">3 badges • 2 projects</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">620</div>
                </div>
                
                <div className="leaderboard-item">
                  <div className="leaderboard-rank">5</div>
                  <div className="leaderboard-user">
                    <div className="user-avatar">RJ</div>
                    <div className="user-info">
                      <div className="user-name">Robin Jones</div>
                      <div className="user-badges">2 badges • 1 project</div>
                    </div>
                  </div>
                  <div className="leaderboard-points">450</div>
                </div>
              </div>
            </div>
          )}
          
        
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
        onSkip={handleSkip}
      />
      <div className="swipe-progress">
        Card {currentCardIndex + 1} of {cards.length}
      </div>
    </div>
  );
};

export default SwipeContainer; 