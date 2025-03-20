import { Project } from '../models/project';

// Keywords that indicate different types of queries
const queryTypes = {
  company: ['company', 'business', 'organization', 'firm'],
  initiative: ['initiative', 'project', 'program', 'effort'],
  challenge: ['challenge', 'problem', 'issue', 'concern'],
  description: ['description', 'details', 'about', 'what'],
  sustainability: ['sustainability', 'environmental', 'green', 'eco', 'climate'],
  technology: ['technology', 'digital', 'software', 'hardware', 'tech'],
  social: ['social', 'community', 'people', 'society', 'human'],
  energy: ['energy', 'power', 'electricity', 'solar', 'wind', 'renewable'],
  waste: ['waste', 'recycling', 'disposal', 'trash', 'garbage'],
  water: ['water', 'ocean', 'sea', 'marine', 'aquatic'],
  carbon: ['carbon', 'emissions', 'footprint', 'climate'],
  education: ['education', 'learning', 'teaching', 'school', 'university'],
  health: ['health', 'medical', 'healthcare', 'wellness'],
  poverty: ['poverty', 'poor', 'needy', 'underprivileged'],
  innovation: ['innovation', 'innovative', 'new', 'novel', 'creative']
};

export const searchProjects = (projects: Project[], query: string): Project[] => {
  if (!query.trim()) return projects;

  const queryLower = query.toLowerCase();
  
  // Extract key terms from the query
  const keyTerms = Object.entries(queryTypes)
    .filter(([_, keywords]) => 
      keywords.some(keyword => queryLower.includes(keyword))
    )
    .map(([type]) => type);

  // If no specific type is found, search across all fields
  if (keyTerms.length === 0) {
    return projects.filter(project => {
      const searchableText = [
        project.initiative,
        project.company,
        project.challenge,
        project.description
      ].filter(Boolean).join(' ').toLowerCase();

      return searchableText.includes(queryLower);
    });
  }

  // Search based on identified query types
  return projects.filter(project => {
    const searchableText = keyTerms.map(type => {
      switch (type) {
        case 'company':
          return project.company;
        case 'initiative':
          return project.initiative;
        case 'challenge':
          return project.challenge;
        case 'description':
          return project.description;
        default:
          return '';
      }
    }).filter(Boolean).join(' ').toLowerCase();

    return searchableText.includes(queryLower);
  });
}; 