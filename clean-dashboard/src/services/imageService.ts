//import axios from 'axios';

// Unsplash API access key - in production, this should be stored in environment variables
// const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your actual access key

// Disabled: UnsplashSearchResponse interface since we're not using it 
/*
interface UnsplashSearchResponse {
  results: {
    id: string;
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    alt_description: string;
  }[];
  total: number;
  total_pages: number;
}
*/

/**
 * DISABLED: External API calls to Unsplash
 * Now always returns a fallback image from our predefined list
 * @param keywords - Keywords to search for (ignored in this implementation)
 * @returns URL of a fallback image
 */
export async function fetchRelevantImage(keywords: string[]): Promise<string> {
  console.log('Image search disabled, using fallback images');
  // Just return a fallback image directly
  return getFallbackImage();
  
  /* DISABLED: Actual API call to Unsplash
  try {
    // Use keywords to form a search query
    const query = keywords.join(' ');
    
    // Create URL for Unsplash API search
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
    
    // Make the API request
    const response = await axios.get<UnsplashSearchResponse>(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    
    // Check if we got any results
    if (response.data.results && response.data.results.length > 0) {
      // Get a random image from the top 5 results
      const randomIndex = Math.floor(Math.random() * Math.min(5, response.data.results.length));
      return response.data.results[randomIndex].urls.regular;
    }
    
    // If no results, return a fallback image
    return getFallbackImage();
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    // Return a fallback image if there's an error
    return getFallbackImage();
  }
  */
}

/**
 * Get a fallback image URL from a predefined list
 * @returns A random fallback image URL
 */
function getFallbackImage(): string {
  // Array of fallback images (these are the same as in collaborationGenerator.ts)
  const fallbackImages = [
    'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1972&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498925008800-019c6d2f3f41?q=80&w=2069&auto=format&fit=crop'
  ];
  
  // Return a random fallback image
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
}

/**
 * Generate keywords for image search based on company descriptions and collaboration topic
 * @param companyDescriptions - Array of company descriptions
 * @param category - Sustainability category
 * @param title - Collaboration title
 * @returns Array of keywords
 */
export function generateImageKeywords(
  companyDescriptions: string[],
  category: string,
  title: string
): string[] {
  // Extract key business terms from company descriptions
  const businessTerms = extractBusinessTerms(companyDescriptions);
  
  // Map categories to relevant image themes
  const categoryThemes: Record<string, string[]> = {
    carbon: ['climate', 'renewable energy', 'carbon reduction', 'clean energy'],
    water: ['ocean conservation', 'clean water', 'water management', 'blue water'],
    biodiversity: ['wildlife', 'forest', 'nature conservation', 'ecosystem'],
    social: ['community', 'people', 'social impact', 'collaboration'],
    circular: ['recycling', 'circular economy', 'sustainable materials', 'upcycling']
  };
  
  // Get themes for this category
  const themes = categoryThemes[category] || ['sustainability'];
  
  // Extract key terms from the title
  const titleTerms = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3)
    .slice(0, 3);
  
  // Combine all terms and prioritize them
  const keywords = [
    ...themes,
    ...businessTerms,
    ...titleTerms,
    'business',
    'sustainability',
    'collaboration'
  ];
  
  // Filter out duplicates and limit to 5 keywords
  return Array.from(new Set(keywords)).slice(0, 5);
}

/**
 * Extract key business terms from company descriptions
 * @param descriptions - Array of company descriptions
 * @returns Array of business terms
 */
function extractBusinessTerms(descriptions: string[]): string[] {
  // Business categories to look for in descriptions
  const businessCategories = [
    'airline', 'travel', 'tourism', 'hotel', 'hospitality', 'music', 'entertainment',
    'media', 'fitness', 'health', 'banking', 'finance', 'telecom', 'communications',
    'retail', 'mobile', 'technology', 'space', 'transportation'
  ];
  
  // Extract matching business terms from descriptions
  const terms: string[] = [];
  descriptions.forEach(description => {
    const lower = description.toLowerCase();
    businessCategories.forEach(category => {
      if (lower.includes(category) && !terms.includes(category)) {
        terms.push(category);
      }
    });
  });
  
  return terms;
} 