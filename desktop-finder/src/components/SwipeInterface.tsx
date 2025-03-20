import React, { useState, useEffect } from 'react';
import CardStack from './CardStack';
import { CardData } from './types';
import { getTopicCardsForSelection } from '../data/initiativeData';

interface SwipeInterfaceProps {
  onFinish: (selectedInterests: string[]) => void;
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({ onFinish }) => {
  const [topicCards, setTopicCards] = useState<CardData[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize with topic cards
  useEffect(() => {
    setTopicCards(getTopicCardsForSelection());
  }, []);

  // Handle card match (right swipe - user is interested in this topic)
  const handleMatch = (card: CardData) => {
    setSelectedInterests(prev => [...prev, card.name]);
  };

  // When all cards are swiped
  const handleFinish = (matches: CardData[]) => {
    setIsFinished(true);
    
    // Extract the names of all matched (liked) topics
    const matchedTopics = matches.map(match => match.name);
    
    // Call the parent component's onFinish with the selected interests
    onFinish(matchedTopics);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto">
      <header className="py-4 px-6 bg-red-700 text-white">
        <h1 className="text-2xl font-bold text-center">Find Your Interests</h1>
        <p className="text-center text-sm opacity-80">
          Swipe right on topics you're interested in
        </p>
      </header>
      
      <main className="flex-1 p-4 relative">
        <div className="h-full w-full max-w-sm mx-auto">
          {isFinished ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-xl font-bold mb-4">Thanks for your selections!</h2>
              <p className="text-gray-600 mb-6">
                We'll find initiatives that match your interests.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg w-full">
                <h3 className="font-medium mb-2">Your selected interests:</h3>
                <ul className="space-y-1">
                  {selectedInterests.map((interest, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {interest}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <CardStack
              initialCards={topicCards}
              onMatch={handleMatch}
              onFinish={handleFinish}
            />
          )}
        </div>
      </main>
      
      <footer className="p-4 text-center text-xs text-gray-500 border-t">
        Virgin Interest Finder &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default SwipeInterface; 