import React, { useState, useEffect } from 'react';
import { CardData } from './types';
import { initiativeMap, initiativeDetails } from '../data/initiativeData';

interface MatchDisplayProps {
  selectedInterests: string[];
  onReset: () => void;
}

const MatchDisplay: React.FC<MatchDisplayProps> = ({ selectedInterests, onReset }) => {
  const [matchedInitiatives, setMatchedInitiatives] = useState<CardData[]>([]);
  
  useEffect(() => {
    if (selectedInterests.length === 0) return;
    
    const matches = findMatchingInitiatives(selectedInterests);
    setMatchedInitiatives(matches);
  }, [selectedInterests]);
  
  // Find initiatives that match the user's selected interests
  const findMatchingInitiatives = (interests: string[]): CardData[] => {
    const matchingInitiatives: {[key: string]: number} = {};
    
    // For each interest, find initiatives that match
    interests.forEach(interest => {
      // Look through the initiative map to find matches
      Object.entries(initiativeMap).forEach(([initiative, topics]) => {
        if (topics.includes(interest)) {
          // Count how many times each initiative matches
          matchingInitiatives[initiative] = (matchingInitiatives[initiative] || 0) + 1;
        }
      });
    });
    
    // Sort initiatives by the number of matching interests (highest first)
    const sortedMatches = Object.entries(matchingInitiatives)
      .sort((a, b) => b[1] - a[1])
      .map(([initiative, matchCount]) => {
        const details = initiativeDetails[initiative];
        
        return {
          id: initiative,
          name: initiative,
          imageUrl: details.imageUrl,
          details: {
            company: details.company,
            challenge: details.challenge,
            description: details.description
          },
          matchCount
        } as CardData & { matchCount: number };
      });
    
    return sortedMatches;
  };
  
  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <header className="py-4 px-6 bg-red-700 text-white">
        <h1 className="text-2xl font-bold text-center">Your Matched Initiatives</h1>
        <p className="text-center text-sm opacity-80">
          Based on your {selectedInterests.length} selected interests
        </p>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        {matchedInitiatives.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-xl font-bold mb-4">No matches found</h2>
            <p className="text-gray-600 mb-6">
              Try selecting different interests to find initiatives that match.
            </p>
            <button
              onClick={onReset}
              className="px-6 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors"
            >
              Start Over
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Your selected interests:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={onReset}
                  className="text-sm text-red-700 hover:underline"
                >
                  Start Over
                </button>
              </div>
            </div>
            
            <h2 className="text-xl font-bold">Matched Initiatives ({matchedInitiatives.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchedInitiatives.map((initiative) => (
                <div key={initiative.id} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${initiative.imageUrl})` }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800 flex-1">{initiative.name}</h3>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                        {(initiative as any).matchCount} match{(initiative as any).matchCount !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">{initiative.details?.company}</p>
                    <p className="text-sm font-medium text-gray-600 mb-3">{initiative.details?.challenge}</p>
                    <p className="text-sm text-gray-500">{initiative.details?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="p-4 text-center text-xs text-gray-500 border-t">
        Virgin Interest Finder &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default MatchDisplay; 