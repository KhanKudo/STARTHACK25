import { Project } from '../utils/projectData';
import { Company } from '../utils/companyData';
import { Proposal } from '../utils/proposalData';

const DEEPSEEK_API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY || 'sk-108d8076bfe54f9ab5695d8f3f2576d6';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface SearchResult {
  projects: Project[];
  explanation: string;
}

export interface TestResponse {
  matchingIds: string[];
  explanation: string;
}

export const searchProjects = async (
  query: string, 
  allProjects: Project[],
  signal?: AbortSignal
): Promise<SearchResult> => {
  try {
    // Prepare the projects data for the API
    const projectsData = allProjects.map(project => ({
      id: project.id,
      title: project.initiative,
      description: project.description,
      challenge: project.challenge,
      company: project.company
    }));

    const prompt = `You are a helpful AI assistant that helps users find relevant projects. 
    The user has searched for: "${query}"

    Here are the available projects:
    ${JSON.stringify(projectsData, null, 2)}

    Return ONLY a JSON object (no markdown, no code blocks) with:
    {
      "matchingIds": string[], // Array of project IDs that best match the search query
      "explanation": string    // A natural, conversational explanation of why these projects were selected. 
                              // Focus on the specific aspects that make them relevant to the search query.
                              // Include details about the projects' goals, challenges, or unique features that match the search.
                              // Make it sound like a helpful assistant explaining their thought process.
    }

    Guidelines for matching:
    - Consider the project's title, description, challenge, and company
    - Look for semantic matches, not just keyword matches
    - Consider the broader context and intent of the search query
    - Match projects that address similar problems or goals
    - Include projects that might be tangentially related but still relevant

    Guidelines for the explanation:
    - Write in a natural, conversational tone
    - Explain the specific aspects that make each project relevant
    - Connect the projects to the user's search intent
    - Highlight unique or interesting features of the matched projects
    - If the match is indirect, explain why it's still relevant
    - Keep it concise but informative`;

    console.log('Sending request to DeepSeek API...');
    console.log('API URL:', DEEPSEEK_API_URL);
    console.log('API Key present:', !!DEEPSEEK_API_KEY);
    console.log('Request payload:', {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
      signal
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from DeepSeek API');
    }

    const content = data.choices[0].message.content;
    console.log('Raw content from API:', content);

    let result: TestResponse;
    try {
      // Remove any markdown code block markers if present
      const cleanContent = content.replace(/```[a-z]*\n|\n```/g, '');
      result = JSON.parse(cleanContent);
      console.log('Parsed result:', result);
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Failed to parse DeepSeek API response');
    }

    // Validate result structure
    if (!Array.isArray(result.matchingIds) || typeof result.explanation !== 'string') {
      console.error('Invalid result structure:', result);
      throw new Error('Invalid result structure from DeepSeek API');
    }
    
    // Filter projects based on matching IDs
    const matchingProjects = allProjects.filter(project => 
      result.matchingIds.includes(project.id)
    );

    console.log('Matching projects:', matchingProjects);
    return {
      projects: matchingProjects,
      explanation: result.explanation
    };
  } catch (error) {
    console.error('Search error:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Search was cancelled');
      }
      throw error;
    }
    throw new Error('Failed to search projects');
  }
};

// Test function to verify DeepSeek search
export const testDeepSeekSearch = async () => {
  const testProjects = [
    {
      id: 'test1',
      initiative: 'Water Conservation Initiative',
      description: 'A project focused on reducing water waste in urban areas through smart irrigation systems',
      challenge: 'Water scarcity in metropolitan regions',
      company: 'EcoTech Solutions',
      imageUrl: '/assets/projects/water-conservation.jpg'
    },
    {
      id: 'test2',
      initiative: 'Solar Energy Expansion',
      description: 'Expanding solar panel installations in residential areas',
      challenge: 'High initial costs of solar installation',
      company: 'GreenPower Inc',
      imageUrl: '/assets/projects/solar-energy.jpg'
    },
    {
      id: 'test3',
      initiative: 'Waste Management System',
      description: 'Implementing smart waste sorting and recycling programs',
      challenge: 'Low recycling rates in urban communities',
      company: 'CleanCity Services',
      imageUrl: '/assets/projects/waste-management.jpg'
    }
  ];

  try {
    console.log('Starting DeepSeek search test...');
    console.log('Test projects:', testProjects);
    
    const result = await searchProjects('Show me water-related projects', testProjects);
    console.log('Test completed successfully');
    console.log('Result:', result);
    
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
};

// Simple test function to verify API connection
export const testDeepSeekAPI = async (): Promise<TestResponse> => {
  try {
    console.log('Testing DeepSeek API connection...');
    console.log('API URL:', DEEPSEEK_API_URL);
    console.log('API Key present:', !!DEEPSEEK_API_KEY);

    const simplePrompt = `Return a JSON object with:
    - matchingIds: ["test1"]
    - explanation: "This is a test response"`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: simplePrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from DeepSeek API');
    }

    const content = data.choices[0].message.content;
    console.log('Response content:', content);

    try {
      const parsedContent = JSON.parse(content);
      console.log('Parsed content:', parsedContent);
      return parsedContent;
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Failed to parse DeepSeek API response as JSON');
    }
  } catch (error) {
    console.error('API test failed:', error);
    throw error;
  }
};

interface ProposalGenerationInput {
  company: Company;
  projects?: Project[];
  project?: Project;
  type: 'company' | 'project';
}

export const generateProposal = async (
    input: ProposalGenerationInput
): Promise<Omit<Proposal, 'id' | 'votes' | 'status' | 'createdAt'>> => {
  const { company, projects, project, type } = input;

  // Create a prompt based on the input type
  let prompt = '';
  if (type === 'company') {
    prompt = `You are an innovative sustainability consultant creating vibrant, engaging proposals. Generate an exciting, forward-thinking sustainability proposal for ${company.name}.

    CONTEXT:
    Company: ${company.name}
    Description: ${company.description}
    Location: ${company.location.latitude}, ${company.location.longitude}
    ${projects ? `Related projects: ${projects.map(p => p.description).join(', ')}` : ''}
    
    GUIDELINES:
    - Be inspiring, bold, and passionate about the possibilities
    - Use vivid language that brings the proposal to life
    - Incorporate concrete, specific details
    - Ensure the proposal sounds like it came from a sustainability expert
    - Think beyond conventional approaches - be innovative!
    - Create realistic but ambitious impact metrics
    - Choose relevant, specific tags that would help categorize this initiative
    - Pick the most appropriate category based on the main focus of your proposal
    
    Please provide a proposal in the following JSON format:
    {
      "title": "A catchy, impactful title",
      "company": "${company.name}",
      "category": "one of: carbon, water, biodiversity, social, circular",
      "description": "A vivid, detailed description that excites and inspires (at least 2 paragraphs)",
      "impact": [
        { "metric": "Specific impact metric name", "value": "Specific measurable value with units" },
        { "metric": "Second metric", "value": "Second value" }
      ],
      "tags": ["tag1", "tag2", "tag3"]
    }`;
  } else {
    prompt = `You are an innovative sustainability consultant creating vibrant, engaging proposals. Generate an exciting, forward-thinking sustainability proposal based on this project for ${company.name}.

    CONTEXT:
    Project description: ${project?.description}
    Company: ${company.name}
    Description: ${company.description}
    Location: ${company.location.latitude}, ${company.location.longitude}
    
    GUIDELINES:
    - Be inspiring, bold, and passionate about the possibilities
    - Use vivid language that brings the proposal to life
    - Incorporate concrete, specific details
    - Ensure the proposal sounds like it came from a sustainability expert
    - Think beyond conventional approaches - be innovative!
    - Create realistic but ambitious impact metrics
    - Choose relevant, specific tags that would help categorize this initiative
    - Pick the most appropriate category based on the main focus of your proposal
    
    Please provide a proposal in the following JSON format:
    {
      "title": "A catchy, impactful title",
      "company": "${company.name}",
      "category": "one of: carbon, water, biodiversity, social, circular",
      "description": "A vivid, detailed description that excites and inspires (at least 2 paragraphs)",
      "impact": [
        { "metric": "Specific impact metric name", "value": "Specific measurable value with units" },
        { "metric": "Second metric", "value": "Second value" }
      ],
      "tags": ["tag1", "tag2", "tag3"]
    }`;
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8, // Slightly higher temperature for more creative responses
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from DeepSeek API');
    }

    const content = data.choices[0].message.content;
    console.log('Raw content from API:', content);

    // Parse the JSON content
    try {
      // Remove markdown code block wrapping if present
      const cleanContent = content.replace(/```json\n|\n```/g, '');
      const parsedProposal = JSON.parse(cleanContent);
      
      return {
        title: parsedProposal.title,
        company: parsedProposal.company,
        category: parsedProposal.category,
        description: parsedProposal.description,
        impact: parsedProposal.impact,
        tags: parsedProposal.tags,
        source: 'ai',
        isRecommended: Math.random() > 0.7 // 30% chance to be recommended
      };
    } catch (parseError) {
      console.error('Failed to parse proposal JSON:', parseError, content);
      // Fall back to generated proposal with the content as description
      throw new Error('Failed to parse the AI-generated proposal');
    }
  } catch (error) {
    console.error('Error generating proposal:', error);
    
    // Fallback values in case of error
    return {
      title: `Innovative Sustainability Initiative for ${company.name}`,
      company: company.name,
      category: ['carbon', 'water', 'biodiversity', 'social', 'circular'][Math.floor(Math.random() * 5)] as any,
      description: `A bold new sustainability initiative that leverages ${company.name}'s unique position in the market. This forward-thinking approach aims to transform how the company addresses environmental challenges while creating substantial business value.
      
      Through strategic implementation of cutting-edge technologies and engagement with key stakeholders, this initiative will set new standards for the industry and demonstrate ${company.name}'s leadership in sustainable innovation.`,
      impact: [
        { metric: 'Carbon Footprint Reduction', value: `${Math.floor(Math.random() * 40 + 20)}%` },
        { metric: 'Annual Resource Savings', value: `$${Math.floor(Math.random() * 900 + 100)}K` }
      ],
      tags: ['Innovation', 'Sustainability', 'Transformation', company.name],
      source: 'ai',
      isRecommended: false
    };
  }
}

// Function to analyze text using DeepSeek API
export const analyzeWithDeepSeek = async (prompt: string): Promise<string> => {
  try {
    console.log('Analyzing with DeepSeek...');
    
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from DeepSeek API');
    }

    const content = data.choices[0].message.content;
    // Remove any markdown code block markers if present
    const cleanContent = content.replace(/```[a-z]*\n|\n```/g, '');
    return cleanContent;
  } catch (error) {
    console.error('DeepSeek analysis error:', error);
    throw error;
  }
}; 