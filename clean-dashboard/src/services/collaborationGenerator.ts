import { Company, COMPANY_DATA } from '../utils/companyData';
import { Project, projectData } from '../utils/projectData';
import { CollaborationOpportunity, addOpportunity } from '../utils/collaborationData';
import { generateProposal, analyzeWithDeepSeek } from './deepseekService';
import { fetchRelevantImage, generateImageKeywords } from './imageService';

// Array of relevant images for collaboration cards
const collaborationImages = [
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1972&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498925008800-019c6d2f3f41?q=80&w=2069&auto=format&fit=crop'
];

// Generate random future date
const generateFutureDate = (): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setMonth(currentDate.getMonth() + Math.floor(Math.random() * 12) + 1);
  return `${months[futureDate.getMonth()]} ${futureDate.getDate()}, ${futureDate.getFullYear()}`;
};

// Generate random funding range
const generateFundingRange = (): string => {
  const minAmount = Math.floor(Math.random() * 20) * 25000 + 50000; // $50K to $500K
  const maxAmount = minAmount + Math.floor(Math.random() * 10) * 50000 + 100000; // min + $100K to min + $600K
  return `$${(minAmount / 1000).toFixed(0)}K - $${(maxAmount / 1000).toFixed(0)}K`;
};

// Local caches for topic analysis and matches to avoid repeated API calls
const projectTopicsCache: Record<string, string[]> = {};
const companyTopicsCache: Record<string, string[]> = {};
const compatibilityCache: Record<string, {score: number, reasons: string[]}> = {};

// Interface for topic analysis response
interface TopicAnalysisResponse {
  topics: string[];
}

// Interface for compatibility analysis
interface CompatibilityAnalysisResponse {
  score: number; // 0-10 compatibility score
  reasons: string[]; // Reasons for compatibility
}

// Interface for collaboration potential analysis
interface CollaborationPotentialResponse {
  title: string;
  description: string;
  benefits: string[];
  innovationScore: number; // 0-10 score for how innovative the collaboration is
}

// Interface for DeepSeek response
interface DeepSeekCollaborationResponse {
  title: string;
  description: string;
  criteria: string[];
  category: 'carbon' | 'water' | 'biodiversity' | 'social' | 'circular';
  economicBenefit: string;
  environmentalImpact: string;
}

// Replace this line:
const previousCollaborationPairs: Record<string, boolean> = {};

// With a more sophisticated tracking system:
interface CollaborationAttributes {
  companies: string[];  // Company IDs
  title: string;        // Title of the collaboration
  keywords: string[];   // Key extracted topics/themes
  category: string;     // Sustainability category
}

// Store previous collaborations with their attributes
const previousCollaborations: CollaborationAttributes[] = [];

// Function to check if a potential collaboration would be too similar to an existing one
function isTooSimilarToExisting(
  companyIds: string[],
  title: string,
  keywords: string[],
  category: string
): boolean {
  // Sort company IDs to ensure consistent comparison regardless of order
  const sortedCompanyIds = [...companyIds].sort();
  
  for (const prevCollab of previousCollaborations) {
    // Check if this involves the same companies
    const sameCompanies = 
      prevCollab.companies.length === sortedCompanyIds.length &&
      prevCollab.companies.every((id, i) => id === sortedCompanyIds[i]);
    
    // If not the same companies, it's definitely not a duplicate
    if (!sameCompanies) continue;
    
    // For the same companies, check if the collaboration is too similar in content
    
    // 1. Check title similarity (using simple substring check for now)
    const titleWords = title.toLowerCase().split(/\s+/);
    const prevTitleWords = prevCollab.title.toLowerCase().split(/\s+/);
    const titleSimilarity = calculateWordOverlap(titleWords, prevTitleWords);
    
    // 2. Check keyword similarity
    const keywordSimilarity = calculateWordOverlap(keywords, prevCollab.keywords);
    
    // 3. Check if same category
    const sameCategory = category === prevCollab.category;
    
    // Calculate overall similarity score (weighted)
    const similarityScore = 
      (titleSimilarity * 0.4) +  // Title has 40% weight
      (keywordSimilarity * 0.5) + // Keywords have 50% weight
      (sameCategory ? 0.1 : 0) ;  // Same category adds 10%
    
    // If similarity is above threshold, consider it too similar
    if (similarityScore > 0.7) {
      console.log(`Detected similar collaboration with score ${similarityScore.toFixed(2)}`);
      console.log(`Previous: ${prevCollab.title} with keywords: ${prevCollab.keywords.join(', ')}`);
      console.log(`Current: ${title} with keywords: ${keywords.join(', ')}`);
      return true;
    }
  }
  
  // If we reach here, it's not too similar to any existing collaboration
  return false;
}

// Helper function to calculate word overlap between two arrays
function calculateWordOverlap(words1: string[], words2: string[]): number {
  if (words1.length === 0 || words2.length === 0) return 0;
  
  // Count matching words
  let matchCount = 0;
  for (const word of words1) {
    if (words2.includes(word)) matchCount++;
  }
  
  // Calculate Jaccard similarity: size of intersection divided by size of union
  const union = new Set([...words1, ...words2]).size;
  return matchCount / union;
}

// Function to add a collaboration to our tracked list
function trackCollaboration(
  companyIds: string[],
  title: string,
  keywords: string[],
  category: string
): void {
  // Sort company IDs to ensure consistent tracking regardless of order
  const sortedCompanyIds = [...companyIds].sort();
  
  // Add to tracked collaborations
  previousCollaborations.push({
    companies: sortedCompanyIds,
    title,
    keywords,
    category
  });
  
  // Limit the size of tracking to avoid memory issues
  if (previousCollaborations.length > 50) {
    previousCollaborations.shift(); // Remove oldest entry
  }
  
  console.log(`Now tracking ${previousCollaborations.length} unique collaborations`);
}

// Stage 1: Analyze company or project to identify key topics
async function analyzeEntityTopics(entity: Company | Project, type: 'company' | 'project'): Promise<string[]> {
  // Check if already cached
  const entityId = type === 'company' 
    ? (entity as Company).id 
    : (entity as Project).initiative.toLowerCase().replace(/\s+/g, '-');
  const cache = type === 'company' ? companyTopicsCache : projectTopicsCache;
  
  if (cache[entityId]) {
    return cache[entityId];
  }
  
  // Prepare description text based on entity type
  const description = type === 'company' 
    ? (entity as Company).description 
    : `${(entity as Project).initiative}: ${(entity as Project).description} ${(entity as Project).challenge || ''}`;
  
  try {
    // Prompt for DeepSeek to analyze and extract key topics
    const prompt = `
    Analyze the following ${type} description and identify 10 key topics they focus on.
    These topics should be mainly related to sustainability and environmental initiatives, but can also include business opportunities.
    For each topic, provide a single phrase (2-4 words) that captures the essence.
    
    ${type.toUpperCase()} DESCRIPTION:
    ${description}
    
    Return ONLY a JSON object with the following format:
    {
      "topics": ["topic1", "topic2", "topic3", ...]
    }
    
    Make sure the topics are specific and substantive, not generic.
    `;
    
    // Call DeepSeek API
    const response = await analyzeWithDeepSeek(prompt);
    
    try {
      // Parse the response
      const result = JSON.parse(response) as TopicAnalysisResponse;
      
      if (!result.topics || !Array.isArray(result.topics)) {
        throw new Error('Invalid response format from topic analysis');
      }
      
      // Cache the result
      cache[entityId] = result.topics;
      return result.topics;
    } catch (error) {
      console.error('Failed to parse topic analysis response:', error);
      // Fallback topics if parsing fails
      const fallbackTopics = [
        'sustainability initiatives',
        'carbon reduction',
        'environmental impact',
        'customer experience',
        'operational efficiency',
        'resource conservation',
        'innovation focus',
        'waste management',
        'brand alignment',
        'stakeholder value'
      ];
      cache[entityId] = fallbackTopics;
      return fallbackTopics;
    }
  } catch (error) {
    console.error(`Failed to analyze ${type} topics:`, error);
    // Fallback topics if API call fails
    const fallbackTopics = [
      'sustainability initiatives',
      'carbon reduction',
      'environmental impact',
      'customer experience',
      'operational efficiency',
      'resource conservation',
      'innovation focus',
      'waste management',
      'brand alignment',
      'stakeholder value'
    ];
    cache[entityId] = fallbackTopics;
    return fallbackTopics;
  }
}

// Stage 2: Find compatibility between two entities (companies or projects)
async function analyzeCompatibility(
  entity1: Company | Project, 
  entity2: Company | Project, 
  type: 'company-company' | 'project-project'
): Promise<CompatibilityAnalysisResponse> {
  // Generate cache key
  const id1 = type.startsWith('company') 
    ? (entity1 as Company).id 
    : (entity1 as Project).initiative.toLowerCase().replace(/\s+/g, '-');
  const id2 = type.startsWith('company')
    ? (entity2 as Company).id
    : (entity2 as Project).initiative.toLowerCase().replace(/\s+/g, '-');
  const cacheKey = `${type}:${id1}:${id2}`;
  
  // Check cache
  if (compatibilityCache[cacheKey]) {
    return compatibilityCache[cacheKey];
  }
  
  // Get topics for both entities
  const topics1 = type.startsWith('company') 
    ? await analyzeEntityTopics(entity1 as Company, 'company')
    : await analyzeEntityTopics(entity1 as Project, 'project');
    
  const topics2 = type.startsWith('company')
    ? await analyzeEntityTopics(entity2 as Company, 'company')
    : await analyzeEntityTopics(entity2 as Project, 'project');
  
  try {
    // Prepare descriptions
    const desc1 = type.startsWith('company')
      ? (entity1 as Company).description 
      : `${(entity1 as Project).initiative}: ${(entity1 as Project).description} ${(entity1 as Project).challenge || ''}`;
      
    const desc2 = type.startsWith('company')
      ? (entity2 as Company).description
      : `${(entity2 as Project).initiative}: ${(entity2 as Project).description} ${(entity2 as Project).challenge || ''}`;
    
    // Prompt for DeepSeek to analyze compatibility
    const prompt = `
    Analyze the compatibility between these two ${type.split('-')[0]}s for potential collaboration:
    
    ${type.split('-')[0].toUpperCase()} 1:
    ${desc1}
    
    KEY TOPICS FOR ${type.split('-')[0].toUpperCase()} 1:
    ${topics1.join(', ')}
    
    ${type.split('-')[0].toUpperCase()} 2:
    ${desc2}
    
    KEY TOPICS FOR ${type.split('-')[0].toUpperCase()} 2:
    ${topics2.join(', ')}
    
    Return ONLY a JSON object with the following format:
    {
      "score": number, // 0-10 compatibility score, with 10 being the most compatible
      "reasons": [string, string, ...] // 3-5 specific reasons why these entities are compatible
    }
    
    Consider both obvious connections AND non-obvious, creative synergies. Sometimes unlikely matches can produce the most innovative collaborations.
    Rate based on business synergy, customer value, and sustainability impact.
    `;
    
    // Call DeepSeek API
    const response = await analyzeWithDeepSeek(prompt);
    
    try {
      // Parse the response
      const result = JSON.parse(response) as CompatibilityAnalysisResponse;
      
      if (typeof result.score !== 'number' || !result.reasons || !Array.isArray(result.reasons)) {
        throw new Error('Invalid response format from compatibility analysis');
      }
      
      // Cache the result
      compatibilityCache[cacheKey] = result;
      return result;
    } catch (error) {
      console.error('Failed to parse compatibility analysis response:', error);
      // Fallback if parsing fails
      const fallback = {
        score: 5,
        reasons: [
          'Shared sustainability focus',
          'Complementary customer bases',
          'Potential for operational synergies'
        ]
      };
      compatibilityCache[cacheKey] = fallback;
      return fallback;
    }
  } catch (error) {
    console.error(`Failed to analyze compatibility:`, error);
    // Fallback if API call fails
    const fallback = {
      score: 5,
      reasons: [
        'Shared sustainability focus',
        'Complementary customer bases',
        'Potential for operational synergies'
      ]
    };
    compatibilityCache[cacheKey] = fallback;
    return fallback;
  }
}

// Stage 3: Analyze specific collaboration potential between two entities
async function analyzeCollaborationPotential(
  entity1: Company | Project,
  entity2: Company | Project,
  type: 'company-company' | 'project-project',
  compatibilityReasons: string[]
): Promise<CollaborationPotentialResponse> {
  // Prepare descriptions
  const desc1 = type.startsWith('company')
    ? (entity1 as Company).description 
    : `${(entity1 as Project).initiative}: ${(entity1 as Project).description} ${(entity1 as Project).challenge || ''}`;
    
  const desc2 = type.startsWith('company')
    ? (entity2 as Company).description
    : `${(entity2 as Project).initiative}: ${(entity2 as Project).description} ${(entity2 as Project).challenge || ''}`;
  
  const name1 = type.startsWith('company') 
    ? (entity1 as Company).name 
    : (entity1 as Project).initiative;
  
  const name2 = type.startsWith('company')
    ? (entity2 as Company).name
    : (entity2 as Project).initiative;
  
  try {
    // Prompt for DeepSeek to propose specific collaboration
    const prompt = `
    Analyze these two ${type.split('-')[0]}s and propose a specific, creative collaboration project that would EQUALLY benefit both:
    
    ${type.split('-')[0].toUpperCase()} 1: ${name1}
    ${desc1}
    
    ${type.split('-')[0].toUpperCase()} 2: ${name2}
    ${desc2}
    
    COMPATIBILITY POINTS:
    ${compatibilityReasons.join('\n')}
    
    Return ONLY a JSON object with the following format:
    {
      "title": string, // Catchy title that mentions BOTH entities
      "description": string, // 1-2 paragraphs describing the specific collaboration, with EQUAL focus on what each entity contributes
      "benefits": [string, string, ...], // 4-6 specific benefits this collaboration would create, ensuring EQUAL benefits to each entity
      "innovationScore": number // 0-10 score for how innovative and unique this collaboration is
    }
    
    IMPORTANT CONSTRAINTS:
    1. This must be a SPECIFIC collaboration project, not a generic partnership
    2. Focus on creating GENUINE value that NEITHER entity could achieve alone
    3. Make sure to EQUALLY highlight the contributions and benefits for BOTH entities
    4. Include both business benefits AND sustainability/environmental impact
    5. Must be realistic and implementable
    6. Be creative and look for non-obvious connections
    7. Explicitly mention BOTH entities by name in the title and throughout the description
    `;
    
    // Call DeepSeek API
    const response = await analyzeWithDeepSeek(prompt);
    
    try {
      // Parse the response
      const result = JSON.parse(response) as CollaborationPotentialResponse;
      
      if (!result.title || !result.description || !result.benefits || typeof result.innovationScore !== 'number') {
        throw new Error('Invalid response format from collaboration potential analysis');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to parse collaboration potential analysis response:', error);
      // Fallback if parsing fails
      return {
        title: `Joint ${name1} and ${name2} Initiative`,
        description: `A strategic collaboration leveraging ${name1}'s strengths in ${desc1.substring(0, 50)}... and ${name2}'s expertise in ${desc2.substring(0, 50)}... to create shared value and environmental impact. This partnership combines complementary capabilities to address common challenges and create new opportunities for both entities.`,
        benefits: [
          `Enhanced capabilities for ${name1}`,
          `New market opportunities for ${name2}`,
          `Combined operational efficiency improvements`,
          `Shared sustainability impact across both entities`
        ],
        innovationScore: 6
      };
    }
  } catch (error) {
    console.error(`Failed to analyze collaboration potential:`, error);
    // Fallback if API call fails
    return {
      title: `Joint ${name1} and ${name2} Initiative`,
      description: `A strategic collaboration leveraging ${name1}'s strengths in ${desc1.substring(0, 50)}... and ${name2}'s expertise in ${desc2.substring(0, 50)}... to create shared value and environmental impact. This partnership combines complementary capabilities to address common challenges and create new opportunities for both entities.`,
      benefits: [
        `Enhanced capabilities for ${name1}`,
        `New market opportunities for ${name2}`,
        `Combined operational efficiency improvements`,
        `Shared sustainability impact across both entities`
      ],
      innovationScore: 6
    };
  }
}

// Find complementary projects using DeepSeek-powered analysis
async function findComplementaryProjects(): Promise<{projects: Project[], compatibilityReasons: string[]} | null> {
  try {
    // If we have fewer than 2 projects, we can't find complementary ones
    if (projectData.length < 2) {
      return null;
    }
    
    // Create pairs of projects to evaluate
    const projectPairs: {project1: Project, project2: Project}[] = [];
    
    for (let i = 0; i < projectData.length; i++) {
      for (let j = i + 1; j < projectData.length; j++) {
        // Only pair projects from different companies
        if (projectData[i].company !== projectData[j].company) {
          projectPairs.push({
            project1: projectData[i],
            project2: projectData[j]
          });
        }
      }
    }
    
    // If we don't have any valid pairs, return null
    if (projectPairs.length === 0) {
      return null;
    }
    
    // Analyze compatibility for each pair
    const compatibilityResults: {
      pair: {project1: Project, project2: Project}, 
      compatibility: CompatibilityAnalysisResponse
    }[] = [];
    
    // To avoid too many API calls, limit to a few random pairs
    const shuffledPairs = [...projectPairs].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (const pair of shuffledPairs) {
      const compatibility = await analyzeCompatibility(
        pair.project1, 
        pair.project2, 
        'project-project'
      );
      
      compatibilityResults.push({
        pair,
        compatibility
      });
    }
    
    // Sort by compatibility score (descending)
    compatibilityResults.sort((a, b) => b.compatibility.score - a.compatibility.score);
    
    // Take the highest compatibility pair, or a random pair if all scores are the same
    const selectedPair = compatibilityResults[0].compatibility.score > compatibilityResults[compatibilityResults.length - 1].compatibility.score
      ? compatibilityResults[0]
      : compatibilityResults[Math.floor(Math.random() * compatibilityResults.length)];
    
    // Return the selected projects with their compatibility reasons
    return {
      projects: [selectedPair.pair.project1, selectedPair.pair.project2],
      compatibilityReasons: selectedPair.compatibility.reasons
    };
  } catch (error) {
    console.error('Error finding complementary projects:', error);
    return null;
  }
}

// Find complementary companies using DeepSeek-powered analysis
async function findComplementaryCompanies(): Promise<{companies: Company[], compatibilityReasons: string[]}> {
  try {
    // Check if we should create a preferred pairing (80% chance)
    const shouldCreatePreferredPairing = Math.random() < 0.8;
    
    if (shouldCreatePreferredPairing) {
      // Find Virgin Atlantic and Virgin Hotels
      const virginAtlantic = COMPANY_DATA.find(c => c.id === 'virgin-atlantic');
      const virginHotels = COMPANY_DATA.find(c => c.id === 'virgin-hotels');
      
      // If both found, create the pairing
      if (virginAtlantic && virginHotels) {
        console.log('Creating preferred pairing: Virgin Atlantic & Virgin Hotels');
        
        // Analyze compatibility for this pair
        const compatibility = await analyzeCompatibility(
          virginAtlantic,
          virginHotels,
          'company-company'
        );
        
        // Mark this pair as used to avoid duplicates in future
        previousCollaborations.push({
          companies: [virginAtlantic.id, virginHotels.id].sort(),
          title: virginAtlantic.name + ' & ' + virginHotels.name,
          keywords: [],
          category: 'carbon'
        });
        
        // Return the selected companies with their compatibility reasons
        return {
          companies: [virginAtlantic, virginHotels],
          compatibilityReasons: compatibility.reasons
        };
      }
    }
    
    // If we didn't create a preferred pairing, continue with regular logic
    // Create pairs of companies to evaluate
    const companyPairs: {company1: Company, company2: Company}[] = [];
    
    // Before creating all pairs, shuffle the company array to avoid picking the same combinations
    // Use Fisher-Yates shuffle for better randomization than sort
    const shuffledCompanies = [...COMPANY_DATA];
    for (let i = shuffledCompanies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCompanies[i], shuffledCompanies[j]] = [shuffledCompanies[j], shuffledCompanies[i]];
    }
    
    // Track the total number of potential company pairs for diversity assessment
    let totalPotentialPairs = 0;
    
    for (let i = 0; i < shuffledCompanies.length; i++) {
      for (let j = i + 1; j < shuffledCompanies.length; j++) {
        totalPotentialPairs++;
        
        // We'll do full content-based duplicate checking later, this is just a basic check
        const recentlyUsedPair = previousCollaborations.some(collab => 
          collab.companies.length === 2 && 
          collab.companies[0] === shuffledCompanies[i].id && 
          collab.companies[1] === shuffledCompanies[j].id
        );
        if (recentlyUsedPair) {
          continue; // Skip this pair as we recently used it
        }
        
        // No airline-hotel specific filtering - allow all valid company combinations
        
        companyPairs.push({
          company1: shuffledCompanies[i],
          company2: shuffledCompanies[j]
        });
      }
    }
    
    // If we're running out of pairs (over 75% of all possible pairs used), reset the tracking
    if (Object.keys(previousCollaborations).length > totalPotentialPairs * 0.75) {
      console.log('Resetting collaboration pair history to allow re-use of pairs');
      for (const key in previousCollaborations) {
        delete previousCollaborations[key];
      }
    }
    
    console.log(`Evaluating ${companyPairs.length} potential company pairs out of ${totalPotentialPairs} total possible pairs`);
    
    // If we have no eligible pairs (all used already), allow re-use of some random pairs
    if (companyPairs.length === 0) {
      console.log('All company pairs used, allowing some re-use');
      
      // Pick 5 random companies to re-use
      const randomCompanies = shuffledCompanies.slice(0, 5);
      for (let i = 0; i < randomCompanies.length; i++) {
        for (let j = i + 1; j < randomCompanies.length; j++) {
          companyPairs.push({
            company1: randomCompanies[i],
            company2: randomCompanies[j]
          });
        }
      }
    }
    
    // Analyze compatibility for each pair
    const compatibilityResults: {
      pair: {company1: Company, company2: Company}, 
      compatibility: CompatibilityAnalysisResponse
    }[] = [];
    
    // To avoid too many API calls, limit to a few random pairs
    // Take 5 pairs instead of 3 to get more diversity
    const shuffledPairs = [...companyPairs].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    for (const pair of shuffledPairs) {
      const compatibility = await analyzeCompatibility(
        pair.company1, 
        pair.company2, 
        'company-company'
      );
      
      compatibilityResults.push({
        pair,
        compatibility
      });
    }
    
    // Sort by compatibility score (descending)
    compatibilityResults.sort((a, b) => b.compatibility.score - a.compatibility.score);
    
    // Add some randomness - 30% chance to not pick the highest score
    const randomFactor = Math.random();
    const selectedPair = randomFactor > 0.7
      ? compatibilityResults[0] // Use highest score
      : compatibilityResults[Math.floor(Math.random() * Math.min(3, compatibilityResults.length))]; // Random from top 3
    
    // Mark this pair as used to avoid duplicates in future
    const pairKey = [selectedPair.pair.company1.id, selectedPair.pair.company2.id].sort().join(':');
    previousCollaborations.push({
      companies: [selectedPair.pair.company1.id, selectedPair.pair.company2.id],
      title: selectedPair.pair.company1.name + ' & ' + selectedPair.pair.company2.name,
      keywords: [],
      category: 'carbon'
    });
    
    // Log how many pairs we've used so far
    console.log(`Used ${Object.keys(previousCollaborations).length} unique company pairs so far`);
    
    // Return the selected companies with their compatibility reasons
    return {
      companies: [selectedPair.pair.company1, selectedPair.pair.company2],
      compatibilityReasons: selectedPair.compatibility.reasons
    };
  } catch (error) {
    console.error('Error finding complementary companies:', error);
    
    // Use a simplified fallback approach - just pick two random companies
    const shuffled = [...COMPANY_DATA].sort(() => 0.5 - Math.random());
    
    // Try to find a pair that hasn't been used too recently
    for (let attempts = 0; attempts < 10; attempts++) {
      const company1 = shuffled[Math.floor(Math.random() * shuffled.length)];
      const company2 = shuffled.find(c => 
        c.id !== company1.id && 
        !isTooSimilarToExisting(
          [company1.id, c.id],
          company1.name + ' & ' + c.name,
          [],
          'carbon'
        )
      );
      
      if (company1 && company2) {
        // Mark as used
        previousCollaborations.push({
          companies: [company1.id, company2.id].sort(),
          title: company1.name + ' & ' + company2.name,
          keywords: [],
          category: 'carbon'
        });
        
        return {
          companies: [company1, company2],
          compatibilityReasons: [
            'Virgin brand alignment',
            'Potential for cross-selling opportunities',
            'Shared sustainability values',
            'Common customer base',
            'Complementary business models'
          ]
        };
      }
    }
    
    // If all else fails, just return two random companies
    return {
      companies: [shuffled[0], shuffled[1]],
      compatibilityReasons: [
        'Virgin brand alignment',
        'Potential for cross-selling opportunities',
        'Shared sustainability values'
      ]
    };
  }
}

// Main function to generate collaboration opportunities
export async function generateCollaborationOpportunities(): Promise<CollaborationOpportunity[]> {
  try {
    let selectedCompanies: Company[] = [];
    let relatedProjects: Project[] = [];
    let collaborationType: string = '';
    let compatibilityReasons: string[] = [];
    
    // First, try to find complementary projects
    const complementaryProjectsResult = await findComplementaryProjects();
    
    if (complementaryProjectsResult) {
      // We found complementary projects from different companies
      collaborationType = 'project-based';
      relatedProjects = complementaryProjectsResult.projects;
      compatibilityReasons = complementaryProjectsResult.compatibilityReasons;
      
      // Get the companies involved in these projects
      const companyNames = new Set(complementaryProjectsResult.projects.map(p => p.company));
      selectedCompanies = COMPANY_DATA.filter(company => 
        companyNames.has(company.name)
      );
      
      // If we couldn't match all companies, add some
      if (selectedCompanies.length < 2) {
        const additionalCompanies = COMPANY_DATA
          .filter(c => !selectedCompanies.some(sc => sc.id === c.id))
          .slice(0, 2 - selectedCompanies.length);
        
        selectedCompanies = [...selectedCompanies, ...additionalCompanies];
      }
    } else {
      // If no complementary projects found, look for complementary companies
      collaborationType = 'company-based';
      const complementaryCompaniesResult = await findComplementaryCompanies();
      selectedCompanies = complementaryCompaniesResult.companies;
      compatibilityReasons = complementaryCompaniesResult.compatibilityReasons;
      
      // Get projects from these companies
      const companyIds = selectedCompanies.map(c => c.id);
      relatedProjects = projectData.filter(project => 
        companyIds.includes(project.company.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'))
      );
      
      // If no specific projects found, just pick some random ones
      if (relatedProjects.length === 0) {
        relatedProjects = projectData.slice(0, 2);
      }
    }
    
    // Get company IDs for the collaboration
    const selectedCompanyIds = selectedCompanies.map(company => company.id);
    
    // Use company names joined together instead of a random organization
    const organization = selectedCompanies.map(company => company.name).join(' & ');
    
    // Determine the most appropriate category based on the projects
    let category: 'carbon' | 'water' | 'biodiversity' | 'social' | 'circular' = 'carbon';
    
    if (relatedProjects.length > 0) {
      const categoryMap: {[key: string]: number} = {
        carbon: 0,
        water: 0,
        biodiversity: 0,
        social: 0,
        circular: 0
      };
      
      relatedProjects.forEach(project => {
        const projectDesc = project.description?.toLowerCase() || '';
        if (projectDesc.includes('carbon') || projectDesc.includes('emission')) categoryMap.carbon++;
        if (projectDesc.includes('water')) categoryMap.water++;
        if (projectDesc.includes('biodiversity') || projectDesc.includes('wildlife')) categoryMap.biodiversity++;
        if (projectDesc.includes('social') || projectDesc.includes('community')) categoryMap.social++;
        if (projectDesc.includes('circular') || projectDesc.includes('recycl')) categoryMap.circular++;
      });
      
      // Find the category with the highest count
      let maxCount = 0;
      Object.entries(categoryMap).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          category = cat as any;
        }
      });
    }
    
    // Stage 3: Analyze specific collaboration potential - this provides balanced input from both companies
    const collaborationPotential = await analyzeCollaborationPotential(
      selectedCompanies[0],
      selectedCompanies[1],
      'company-company',
      compatibilityReasons
    );
    
    // Create collaboration content directly from the collaboration potential analysis
    const collaborationContent: DeepSeekCollaborationResponse = {
      title: collaborationPotential.title,
      description: collaborationPotential.description,
      criteria: collaborationPotential.benefits.map(benefit => `Implement: ${benefit}`),
      category: category,
      economicBenefit: "Enhanced customer value and business efficiency through combined strengths",
      environmentalImpact: "Improved sustainability outcomes through collaborative resource optimization"
    };
    
    // Ensure the description mentions both environmental and economic benefits
    if (!collaborationContent.description.toLowerCase().includes('economic') || 
        !collaborationContent.description.toLowerCase().includes('environment')) {
      collaborationContent.description += `\n\nThis initiative delivers dual benefits: environmentally through improved sustainability outcomes and collaborative resource optimization, while economically enhancing customer value and business efficiency through the combined strengths of ${selectedCompanies[0].name} and ${selectedCompanies[1].name}.`;
    }
    
    // Generate relevant keywords for image search based on the collaboration
    const companyDescriptions = selectedCompanies.map(company => company.description);
    const imageKeywords = generateImageKeywords(
      companyDescriptions,
      category,
      collaborationContent.title
    );
    
    console.log('Generated image keywords:', imageKeywords);
    
    // Skip external API image search and use local fallback images instead
    // This avoids making external API calls to Unsplash that require an API key
    const imageUrl = collaborationImages[Math.floor(Math.random() * collaborationImages.length)];
    console.log('Using fallback collaboration image URL:', imageUrl);
    
    // Create the collaboration opportunity
    const newOpportunity: Omit<CollaborationOpportunity, 'id'> = {
      title: collaborationContent.title,
      organization: organization,
      description: collaborationContent.description,
      criteria: collaborationContent.criteria,
      fundingAvailable: generateFundingRange(),
      deadline: generateFutureDate(),
      category: collaborationContent.category,
      imageUrl: imageUrl,
      companies: selectedCompanyIds,
      source: 'ai'
    };
    
    // Extract keywords from the collaboration for similarity checking
    const extractedKeywords = [
      ...collaborationContent.title.toLowerCase().split(/\s+/).filter(word => word.length > 4),
      ...collaborationContent.description.toLowerCase().split(/\s+/)
        .filter(word => word.length > 5)
        .slice(0, 10),
      ...collaborationContent.criteria.map(c => c.toLowerCase().replace(/implement:?\s*/i, '').trim())
    ];

    // Check if this collaboration is too similar to previous ones
    const isTooSimilar = isTooSimilarToExisting(
      selectedCompanyIds,
      collaborationContent.title,
      extractedKeywords,
      category
    );

    // If too similar, try again with a different pair
    if (isTooSimilar) {
      console.log('Generated collaboration too similar to existing one, trying again...');
      return generateCollaborationOpportunities(); // Recursive call to try again
    }

    // If not too similar, track this collaboration for future comparison
    trackCollaboration(
      selectedCompanyIds,
      collaborationContent.title,
      extractedKeywords,
      category
    );
    
    // Add to the data store
    const addedOpportunity = addOpportunity(newOpportunity);
    
    return [addedOpportunity];
  } catch (error) {
    console.error('Error generating collaboration opportunities:', error);
    return [];
  }
}