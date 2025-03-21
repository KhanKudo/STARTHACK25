import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
// @ts-ignore
import ForceGraph2D from 'react-force-graph-2d';
// @ts-ignore
import * as d3 from 'd3';
import { COMPANY_DATA } from '../utils/companyData';
import { projectData } from '../utils/projectData';
import { proposalData } from '../utils/proposalData';
import { collaborationData } from '../utils/collaborationData';
import './KnowledgeCenter.css';

// Add missing TypeScript declarations at the top
declare global {
  interface Window {
    summaryDebounceTimeout: NodeJS.Timeout | undefined;
  }
}

interface GraphNode {
  id: string;
  name: string;
  type: 'company' | 'project' | 'topic' | 'proposal' | 'collaboration';
  description?: string;
  category?: string;
  topics: string[];
  val: number; // Size of node
  color?: string;
  img?: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number; // Link strength
  description?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface TopicInfo {
  name: string;
  color: string;
  keywords: string[];
}

// Define the main topics with their associated colors and keywords
const TOPICS: Record<string, TopicInfo> = {
  sustainability: {
    name: 'Sustainability',
    color: '#4CAF50',
    keywords: ['sustainable', 'green', 'eco', 'environment', 'emission', 'carbon', 'climate']
  },
  travel: {
    name: 'Travel & Hospitality',
    color: '#2196F3',
    keywords: ['travel', 'flight', 'airline', 'hotel', 'vacation', 'tourism', 'hospitality', 'passenger']
  },
  entertainment: {
    name: 'Entertainment & Media',
    color: '#9C27B0',
    keywords: ['entertainment', 'media', 'content', 'music', 'radio', 'broadcast', 'record', 'production']
  },
  financial: {
    name: 'Financial Services',
    color: '#FFC107',
    keywords: ['financial', 'banking', 'payment', 'money', 'investment', 'finance', 'economic']
  },
  health: {
    name: 'Health & Wellness',
    color: '#E91E63',
    keywords: ['health', 'wellness', 'fitness', 'wellbeing', 'active', 'lifestyle', 'exercise']
  },
  telecom: {
    name: 'Telecommunications',
    color: '#00BCD4',
    keywords: ['telecom', 'communication', 'network', 'mobile', 'broadband', 'internet', 'connection']
  },
  technology: {
    name: 'Technology & Innovation',
    color: '#795548',
    keywords: ['technology', 'innovation', 'digital', 'tech', 'solution', 'platform', 'software']
  },
  aerospace: {
    name: 'Aerospace',
    color: '#607D8B',
    keywords: ['space', 'aerospace', 'satellite', 'orbit', 'launch', 'rocket', 'aviation']
  }
};

const KnowledgeCenter: React.FC = () => {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);
  const graphRef = useRef<any>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [topicDensityMap, setTopicDensityMap] = useState<Record<string, any[]>>({});
  const [viewportSummary, setViewportSummary] = useState<string>('');
  const [showSummary, setShowSummary] = useState<boolean>(false);
  
  // Color customization
  const [topicColors, setTopicColors] = useState<Record<string, string>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [customTopics, setCustomTopics] = useState<Record<string, TopicInfo>>({});
  
  // Predefined colors for the color picker
  const colorOptions = [
    '#4CAF50', '#2196F3', '#9C27B0', '#FFC107', '#E91E63', 
    '#00BCD4', '#795548', '#607D8B', '#FF5722', '#3F51B5',
    '#8BC34A', '#9E9E9E', '#FF9800', '#CDDC39', '#F44336'
  ];
  
  // Get effective topic color (custom or default)
  const getTopicColor = (topicKey: string) => {
    return topicColors[topicKey] || TOPICS[topicKey]?.color || '#999999';
  };
  
  // Handle opening color picker for a topic
  const handleOpenColorPicker = (topicKey: string) => {
    setCurrentTopic(topicKey);
    setShowColorPicker(true);
  };
  
  // Apply selected color to topic
  const applyTopicColor = (color: string) => {
    if (!currentTopic) return;
    
    const newTopicColors = { ...topicColors, [currentTopic]: color };
    setTopicColors(newTopicColors);
    setShowColorPicker(false);
    
    // Update node colors in the graph
    if (graphData.nodes.length > 0) {
      const updatedNodes = graphData.nodes.map(node => {
        if (node.topics && node.topics.includes(currentTopic)) {
          return {
            ...node,
            color: getNodeColor(node.topics, newTopicColors)
          };
        }
        return node;
      });
      
      setGraphData({
        ...graphData,
        nodes: updatedNodes
      });
    }
  };
  
  // Reset topic to default color
  const resetTopicColor = () => {
    if (!currentTopic) return;
    
    const newTopicColors = { ...topicColors };
    delete newTopicColors[currentTopic];
    
    setTopicColors(newTopicColors);
    setShowColorPicker(false);
    
    // Update node colors in the graph
    if (graphData.nodes.length > 0) {
      const updatedNodes = graphData.nodes.map(node => {
        if (node.topics && node.topics.includes(currentTopic)) {
          return {
            ...node,
            color: getNodeColor(node.topics, newTopicColors)
          };
        }
        return node;
      });
      
      setGraphData({
        ...graphData,
        nodes: updatedNodes
      });
    }
  };
  
  // Handle zoom change - add safety check for event argument
  const handleZoom = useCallback((event: any) => {
    if (event && typeof event.k === 'number') {
      setZoomLevel(event.k);
    }
  }, []);
  
  // Extract topics from text
  const extractTopics = (text: string): string[] => {
    if (!text) return [];
    const topics: string[] = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(TOPICS).forEach(([topicKey, topicInfo]) => {
      // Check for topic name
      if (lowerText.includes(topicInfo.name.toLowerCase())) {
        topics.push(topicKey);
      } else {
        // Check for keywords
        for (const keyword of topicInfo.keywords) {
          if (lowerText.includes(keyword.toLowerCase())) {
            topics.push(topicKey);
            break;
          }
        }
      }
    });
    
    // Remove duplicates
    return Array.from(new Set(topics));
  };
  
  // Automatic proposal and collaboration generation
  const [generatedNodes, setGeneratedNodes] = useState<GraphNode[]>([]);
  const lastGenerationTime = useRef<number>(Date.now());
  
  // Generate a random collaboration or proposal
  const generateRandomNode = useCallback(() => {
    // Randomly choose between collaboration and proposal
    const nodeType = Math.random() > 0.5 ? 'collaboration' : 'proposal';
    const id = `${nodeType}-auto-${Date.now()}`;
    
    // Select random companies to connect
    const companies = COMPANY_DATA.slice();
    const shuffled = companies.sort(() => 0.5 - Math.random());
    const selectedCompanies = shuffled.slice(0, 2);
    
    // Create topics based on company data
    const combinedText = selectedCompanies.map(c => c.description).join(' ');
    const extractedTopics = extractTopics(combinedText);
    
    // Pick random topic from the extracted ones or use a default
    const mainTopic = extractedTopics.length > 0 
      ? extractedTopics[Math.floor(Math.random() * extractedTopics.length)]
      : 'technology';
    
    // Generate a title based on companies and main topic
    const title = nodeType === 'collaboration'
      ? `${selectedCompanies[0].name} + ${selectedCompanies[1].name} ${TOPICS[mainTopic]?.name || ''} Initiative`
      : `${TOPICS[mainTopic]?.name || ''} Proposal for ${selectedCompanies[0].name}`;
    
    // Create a short description
    const descriptions = [
      `Exploring innovative ways to leverage ${TOPICS[mainTopic]?.name || 'technology'} solutions.`,
      `Building a sustainable partnership in the ${TOPICS[mainTopic]?.name || ''} space.`,
      `Developing new customer experiences through ${TOPICS[mainTopic]?.name || 'technology'}.`,
      `Creating value through ${TOPICS[mainTopic]?.name || ''} integration.`,
      `Enhancing market presence with ${TOPICS[mainTopic]?.name || 'innovative'} approaches.`
    ];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Create the new node
    const newNode: GraphNode = {
      id,
      name: title,
      description,
      type: nodeType as 'collaboration' | 'proposal',
      category: TOPICS[mainTopic]?.name || 'Technology',
      topics: [mainTopic, ...extractedTopics.slice(0, 2)],
      val: nodeType === 'collaboration' ? 7 : 4,
      color: getTopicColor(mainTopic)
    };
    
    return {
      node: newNode,
      companyIds: selectedCompanies.map(c => `company-${c.id}`)
    };
  }, [extractTopics, getTopicColor]);
  
  // Add a helper function to add nodes to graph
  const addNodeToGraph = useCallback((generated: any) => {
    // Update the graph with the new node and connections
    setGraphData(prevData => {
      const updatedNodes = [...prevData.nodes, generated.node];
      const newLinks = generated.companyIds.map((companyId: string) => ({
        source: generated.node.id,
        target: companyId,
        value: 0.8
      }));
      
      return {
        nodes: updatedNodes,
        links: [...prevData.links, ...newLinks]
      };
    });
    
    setGeneratedNodes(prev => [...prev, generated.node]);
    lastGenerationTime.current = Date.now();
    
    console.log(`Generated new ${generated.node.type}: ${generated.node.name}`);
  }, []);
  
  // Periodically generate new nodes - updated to use the helper function
  useEffect(() => {
    // Generate one node immediately after initial data load
    let initialNodeTimeout: NodeJS.Timeout;
    if (graphData.nodes.length > 0 && !loading) {
      initialNodeTimeout = setTimeout(() => {
        const generated = generateRandomNode();
        addNodeToGraph(generated);
      }, 5000); // Generate first node after 5 seconds
    }
    
    // Set up regular interval for generating new nodes
    const generateInterval = setInterval(() => {
      // Only generate if it's been at least 90 seconds (1.5 minutes) since last generation
      const currentTime = Date.now();
      if (currentTime - lastGenerationTime.current >= 90000) {
        const generated = generateRandomNode();
        addNodeToGraph(generated);
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      if (initialNodeTimeout) clearTimeout(initialNodeTimeout);
      clearInterval(generateInterval);
    };
  }, [graphData.nodes.length, loading, generateRandomNode, addNodeToGraph]);
  
  // Calculate similarity between two nodes based on shared topics
  const calculateSimilarity = (node1: GraphNode, node2: GraphNode): number => {
    if (!node1.topics || !node2.topics) return 0;
    
    const sharedTopics = node1.topics.filter(topic => node2.topics.includes(topic));
    
    if (sharedTopics.length === 0) return 0.1; // Minimal similarity
    
    // Topic proximity weighting - topics that are related have higher similarity
    const topicProximity: Record<string, string[]> = {
      // Travel and hospitality are closely related
      'travel': ['entertainment', 'health'],
      'entertainment': ['travel', 'technology', 'health'],
      'financial': ['technology', 'telecom'],
      'technology': ['telecom', 'entertainment', 'aerospace', 'financial'],
      'sustainability': ['health', 'aerospace'],
      'health': ['sustainability', 'travel', 'entertainment'],
      'telecom': ['technology', 'financial'],
      'aerospace': ['technology', 'sustainability']
    };
    
    // Calculate proximity bonus
    let proximityBonus = 0;
    sharedTopics.forEach(topic => {
      node1.topics.forEach(t1 => {
        if (t1 !== topic && topicProximity[topic]?.includes(t1)) {
          proximityBonus += 0.15; // Add bonus for each proximate topic
        }
      });
      
      node2.topics.forEach(t2 => {
        if (t2 !== topic && topicProximity[topic]?.includes(t2)) {
          proximityBonus += 0.15; // Add bonus for each proximate topic
        }
      });
    });
    
    // Higher similarity for nodes of the same type
    const typeSimilarityBonus = node1.type === node2.type ? 1.5 : 1;
    
    // Calculate base similarity from shared topics
    const baseSimilarity = (sharedTopics.length / Math.max(1, Math.sqrt(node1.topics.length * node2.topics.length))) 
      * typeSimilarityBonus;
    
    // Add proximity bonus with a cap at 1.0
    return Math.min(baseSimilarity + proximityBonus, 1);
  };
  
  // Determine primary color of a node based on its topics
  const getNodeColor = (topics: string[], customColors?: Record<string, string>): string => {
    if (!topics || topics.length === 0) return '#999999'; // Default gray
    
    const colorMap = customColors || topicColors;
    
    // If only one topic, use that topic's color (custom or default)
    if (topics.length === 1) {
      return colorMap[topics[0]] || TOPICS[topics[0]]?.color || '#999999';
    }
    
    // For multiple topics, use the first one's color
    return colorMap[topics[0]] || TOPICS[topics[0]]?.color || '#999999';
  };
  
  // Calculate topic density across the canvas
  const calculateTopicDensity = useCallback(() => {
    if (!graphData.nodes.length) return;
    
    // Group nodes by topic
    const topicGroups: Record<string, any[]> = {};
    
    graphData.nodes.forEach(node => {
      if (node.topics && node.topics.length && node.x !== undefined && node.y !== undefined) {
        node.topics.forEach(topic => {
          if (!topicGroups[topic]) topicGroups[topic] = [];
          topicGroups[topic].push({
            x: node.x,
            y: node.y,
            color: getTopicColor(topic)
          });
        });
      }
    });
    
    setTopicDensityMap(topicGroups);
  }, [graphData.nodes, getTopicColor]);
  
  // Function to build graph data
  const buildGraphData = useCallback(async () => {
    setLoading(true);
    
    try {
      let nodes: GraphNode[] = [];
      let links: GraphLink[] = [];
      
      // Add companies
      COMPANY_DATA.forEach(company => {
        const topics = extractTopics(company.description + ' ' + company.sector);
        
        nodes.push({
          id: `company-${company.id}`,
          name: company.name,
          description: company.description,
          type: 'company',
          topics: topics,
          val: 8,  // Larger size for companies
          color: getNodeColor(topics, topicColors),
          img: company.images.logo
        });
      });
      
      // Add projects
      projectData.forEach(project => {
        const combinedText = `${project.initiative} ${project.description || ''} ${project.challenge || ''}`;
        const topics = extractTopics(combinedText);
        
        const projectNode: GraphNode = {
          id: `project-${project.id}`,
          name: project.initiative,
          description: project.description || project.challenge,
          type: 'project',
          topics: topics,
          val: 6,  // Medium size for projects
          color: getNodeColor(topics, topicColors)
        };
        nodes.push(projectNode);
        
        // Connect projects to companies
        const companyNode = nodes.find(node => 
          node.type === 'company' && 
          project.company.includes(node.name)
        );
        
        if (companyNode) {
          const similarity = calculateSimilarity(projectNode, companyNode);
          links.push({
            source: projectNode.id,
            target: companyNode.id,
            value: similarity * 2 // Stronger connection for ownership
          });
        }
      });
      
      // Add proposals with smaller node size
      proposalData.forEach(proposal => {
        const topics = extractTopics(proposal.title + ' ' + proposal.description);
        
        const proposalNode: GraphNode = {
          id: `proposal-${proposal.id}`,
          name: proposal.title,
          description: proposal.description,
          type: 'proposal',
          category: proposal.category,
          topics: [...topics, proposal.category], // Include category as a topic
          val: 4,  // Smaller size for proposals
          color: getNodeColor([...topics, proposal.category], topicColors)
        };
        nodes.push(proposalNode);
        
        // Connect proposals to targeted companies
        const companyNode = nodes.find(node => 
          node.type === 'company' && 
          proposal.company.includes(node.name)
        );
        
        if (companyNode) {
          const similarity = calculateSimilarity(proposalNode, companyNode);
          links.push({
            source: proposalNode.id,
            target: companyNode.id,
            value: similarity
          });
        }
      });
      
      // Add collaborations with medium-large node size
      collaborationData.forEach(collab => {
        const topics = extractTopics(collab.title + ' ' + collab.description);
        
        const collabNode: GraphNode = {
          id: `collab-${collab.id}`,
          name: collab.title,
          description: collab.description,
          type: 'collaboration',
          category: collab.category,
          topics: [...topics, collab.category], // Include category as a topic
          val: 7,  // Medium-large size for collaborations
          color: getNodeColor([...topics, collab.category], topicColors)
        };
        nodes.push(collabNode);
        
        // Connect collaborations to related companies
        collab.companies.forEach(companyId => {
          const companyNodeId = `company-${companyId}`;
          const companyNode = nodes.find(node => node.id === companyNodeId);
          
          if (companyNode) {
            const similarity = calculateSimilarity(collabNode, companyNode);
            links.push({
              source: collabNode.id,
              target: companyNodeId,
              value: similarity
            });
          }
        });
      });
      
      // Add links between similar nodes within the same type
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          // Skip if nodes are the same or already connected
          if (i === j || links.some(link => 
            (link.source === nodes[i].id && link.target === nodes[j].id) || 
            (link.source === nodes[j].id && link.target === nodes[i].id)
          )) {
            continue;
          }
          
          const similarity = calculateSimilarity(nodes[i], nodes[j]);
          
          // Increased threshold for more selective connections
          if (similarity > 0.75) {
            links.push({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity * 0.5 // Weaker than direct connections
            });
          }
        }
      }
      
      // Initial positioning for better layout - spread nodes in a circle with more spacing
      const total = nodes.length;
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.45; // Increased radius
      nodes.forEach((node, i) => {
        const angle = (i / total) * 2 * Math.PI;
        // Add some randomness to the initial positions with more spread
        node.x = Math.cos(angle) * radius + (Math.random() - 0.5) * radius * 0.7;
        node.y = Math.sin(angle) * radius + (Math.random() - 0.5) * radius * 0.7;
      });
      
      // Ensure all nodes have valid properties to prevent rendering errors
      nodes.forEach(node => {
        // Make sure all properties have valid defaults
        if (!node.val || isNaN(node.val)) node.val = 5;
        if (!node.topics) node.topics = [];
        if (!node.color) node.color = '#999999';
      });
      
      setGraphData({ nodes, links });
    } catch (error) {
      console.error("Error building graph data:", error);
    } finally {
      setLoading(false);
    }
  }, [topicColors]);
  
  // Load data when component mounts
  useEffect(() => {
    buildGraphData();
  }, [buildGraphData]);
  
  // Custom node rendering function
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!node || !ctx || !globalScale) return;
    
    try {
      // Skip rendering if node position is not defined yet
      if (node.x === undefined || node.y === undefined || 
          isNaN(node.x) || isNaN(node.y)) {
        return;
      }
      
      // Get node properties with safe fallbacks
      const nodeColor = node.color || '#666666';
      const neutralColor = '#f5f5f5'; // Light gray for node body
      const nodeSize = Math.max(4, (Math.sqrt(node.val || 5) * 2)) / globalScale;
      const fontSize = Math.max(3, 3 / globalScale); // Make font 1/3 of current size
      
      // Draw halo effect (glow) safely
      try {
        const haloSize = nodeSize * 2.5;
        // Use simple transparent circle for halo to avoid gradient issues
        ctx.fillStyle = `${nodeColor}30`; // 30% opacity
        ctx.beginPath();
        ctx.arc(node.x, node.y, haloSize, 0, 2 * Math.PI);
        ctx.fill();
      } catch (e) {
        // Ignore halo rendering errors
      }
      
      // Draw different shapes based on node type
      ctx.fillStyle = neutralColor;
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 1 / globalScale;
      
      switch(node.type) {
        case 'company':
          // Rounded rectangle for companies
          const rectSize = nodeSize * 1.6;
          const cornerRadius = nodeSize * 0.3;
          
          ctx.beginPath();
          ctx.moveTo(node.x - rectSize/2 + cornerRadius, node.y - rectSize/2);
          ctx.lineTo(node.x + rectSize/2 - cornerRadius, node.y - rectSize/2);
          ctx.quadraticCurveTo(node.x + rectSize/2, node.y - rectSize/2, node.x + rectSize/2, node.y - rectSize/2 + cornerRadius);
          ctx.lineTo(node.x + rectSize/2, node.y + rectSize/2 - cornerRadius);
          ctx.quadraticCurveTo(node.x + rectSize/2, node.y + rectSize/2, node.x + rectSize/2 - cornerRadius, node.y + rectSize/2);
          ctx.lineTo(node.x - rectSize/2 + cornerRadius, node.y + rectSize/2);
          ctx.quadraticCurveTo(node.x - rectSize/2, node.y + rectSize/2, node.x - rectSize/2, node.y + rectSize/2 - cornerRadius);
          ctx.lineTo(node.x - rectSize/2, node.y - rectSize/2 + cornerRadius);
          ctx.quadraticCurveTo(node.x - rectSize/2, node.y - rectSize/2, node.x - rectSize/2 + cornerRadius, node.y - rectSize/2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Draw a colored square in the center
          ctx.fillStyle = nodeColor;
          const innerRectSize = nodeSize * 0.8;
          ctx.fillRect(
            node.x - innerRectSize/2,
            node.y - innerRectSize/2,
            innerRectSize,
            innerRectSize
          );
          break;
          
        case 'collaboration':
          // Triangle for collaborations
          const triangleSize = nodeSize * 1.5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y - triangleSize);
          ctx.lineTo(node.x + triangleSize, node.y + triangleSize/2);
          ctx.lineTo(node.x - triangleSize, node.y + triangleSize/2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Draw a smaller colored triangle in the center
          ctx.fillStyle = nodeColor;
          const innerTriangleSize = nodeSize * 0.75;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y - innerTriangleSize);
          ctx.lineTo(node.x + innerTriangleSize, node.y + innerTriangleSize/2);
          ctx.lineTo(node.x - innerTriangleSize, node.y + innerTriangleSize/2);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'proposal':
          // Inverted triangle for proposals
          const invTriangleSize = nodeSize * 1.5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y + invTriangleSize);
          ctx.lineTo(node.x + invTriangleSize, node.y - invTriangleSize/2);
          ctx.lineTo(node.x - invTriangleSize, node.y - invTriangleSize/2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Draw a smaller colored triangle in the center
          ctx.fillStyle = nodeColor;
          const innerInvTriangleSize = nodeSize * 0.75;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y + innerInvTriangleSize);
          ctx.lineTo(node.x + innerInvTriangleSize, node.y - innerInvTriangleSize/2);
          ctx.lineTo(node.x - innerInvTriangleSize, node.y - innerInvTriangleSize/2);
          ctx.closePath();
          ctx.fill();
          break;
          
        default:
          // Circle for projects and other types
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          
          // Draw a smaller colored circle in the center
          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize * 0.5, 0, 2 * Math.PI);
          ctx.fill();
      }
      
      // Always show node label with lightweight font
      const label = (node.name || '').substring(0, 15) + 
                   ((node.name || '').length > 15 ? '...' : '');
      
      // Calculate label position based on node type
      let labelY = node.y;
      switch(node.type) {
        case 'company':
          labelY = node.y + nodeSize * 1.8;
          break;
        case 'collaboration':
          labelY = node.y + nodeSize * 2;
          break;
        case 'proposal':
          labelY = node.y + nodeSize * 2;
          break;
        default:
          labelY = node.y + nodeSize * 1.6;
      }
      
      // Draw text with subtle shadow for better readability
      ctx.font = `200 ${fontSize}px Inter, Arial, Sans-Serif`; // Even lighter weight font
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      // Text shadow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(label, node.x + 0.5/globalScale, labelY + 0.5/globalScale);
      
      // Actual text
      ctx.fillStyle = 'rgba(100, 100, 100, 0.7)'; // Even lighter gray for more subtle labels
      ctx.fillText(label, node.x, labelY);
      
    } catch (err) {
      // Fallback to simple circle if any errors
      if (node.x !== undefined && node.y !== undefined && 
          !isNaN(node.x) && !isNaN(node.y)) {
        ctx.fillStyle = '#999';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5 / globalScale, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, [zoomLevel, topicColors]);
  
  // Update density map when graph data changes
  useEffect(() => {
    calculateTopicDensity();
  }, [graphData, calculateTopicDensity]);

  // Improve the generateViewportSummary function
  const generateViewportSummary = useCallback(async (visibleNodes: GraphNode[]) => {
    if (visibleNodes.length < 3 || visibleNodes.length > 20) {
      setShowSummary(false);
      return;
    }
    
    try {
      // Get counts for different node types and topics
      const topicCounts: Record<string, number> = {};
      const typeCount: Record<string, number> = {};
      const companies: string[] = [];
      
      visibleNodes.forEach(node => {
        // Count node types
        typeCount[node.type] = (typeCount[node.type] || 0) + 1;
        
        // Save company names
        if (node.type === 'company') {
          companies.push(node.name);
        }
        
        // Count topics
        node.topics?.forEach(topic => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      });
      
      // Find dominant topics
      const sortedTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([topic, count]) => {
          const name = TOPICS[topic]?.name || customTopics[topic]?.name || topic;
          return `${name} (${count})`;
        });
      
      // Generate more contextual summary
      let summary = `Viewing ${visibleNodes.length} items in this area. `;
      
      // Add topic focus
      if (sortedTopics.length > 0) {
        summary += `Primary topics: ${sortedTopics.join(', ')}. `;
      }
      
      // Add node type breakdown
      const nodeTypeCounts = [];
      if (typeCount['company']) nodeTypeCounts.push(`${typeCount['company']} companies`);
      if (typeCount['project']) nodeTypeCounts.push(`${typeCount['project']} projects`);
      if (typeCount['collaboration']) nodeTypeCounts.push(`${typeCount['collaboration']} collaborations`);
      if (typeCount['proposal']) nodeTypeCounts.push(`${typeCount['proposal']} proposals`);
      
      if (nodeTypeCounts.length) {
        summary += `Includes ${nodeTypeCounts.join(', ')}. `;
      }
      
      // Add specific company highlights if not too many
      if (companies.length > 0 && companies.length <= 3) {
        summary += `Featured companies: ${companies.join(', ')}`;
      }
      
      // Set the summary text
      setViewportSummary(summary);
      setShowSummary(true);
    } catch (error) {
      console.error("Error generating summary:", error);
      setShowSummary(false);
    }
  }, [TOPICS, customTopics]);
  
  // Fix the handleViewportChange function to improve pan and zoom
  const handleViewportChange = useCallback((transform: any) => {
    if (!transform || !graphRef.current || !graphData.nodes.length) return;
    
    // Only show summary if sufficiently zoomed in (higher threshold)
    if (transform.k < 1.7) {
      setShowSummary(false);
      return;
    }
    
    // Get current viewport dimensions
    const graphElement = graphRef.current.containerElem;
    if (!graphElement) return;
    
    const graphRect = graphElement.getBoundingClientRect();
    const graphWidth = graphRect.width;
    const graphHeight = graphRect.height;
    
    // Calculate visible area in graph coordinates
    const leftX = (-transform.x) / transform.k;
    const topY = (-transform.y) / transform.k;
    const rightX = leftX + (graphWidth / transform.k);
    const bottomY = topY + (graphHeight / transform.k);
    
    // Find nodes that are in the visible area
    const visibleNodes = graphData.nodes.filter(node => {
      if (node.x === undefined || node.y === undefined) return false;
      return (
        node.x >= leftX && 
        node.x <= rightX && 
        node.y >= topY && 
        node.y <= bottomY
      );
    });
    
    // Generate summary for visible nodes - with debounce
    if (visibleNodes.length > 0) {
      // Debounce to avoid constant updates while panning
      if (window.summaryDebounceTimeout) {
        clearTimeout(window.summaryDebounceTimeout);
      }
      
      window.summaryDebounceTimeout = setTimeout(() => {
        generateViewportSummary(visibleNodes);
      }, 300);
    } else {
      setShowSummary(false);
    }
  }, [graphData.nodes, generateViewportSummary]);

  // Draw background glow
  const drawBackgroundGlow = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // For each topic group, create a gaussian-like glow
    Object.entries(topicDensityMap).forEach(([topic, nodes]) => {
      if (nodes.length < 3) return; // Only draw for topics with sufficient nodes
      
      // Find the centroid of the nodes for this topic
      const centroidX = nodes.reduce((sum, node) => sum + node.x, 0) / nodes.length;
      const centroidY = nodes.reduce((sum, node) => sum + node.y, 0) / nodes.length;
      
      // Calculate the average distance from centroid to determine glow radius
      const distances = nodes.map(node => 
        Math.sqrt(Math.pow(node.x - centroidX, 2) + Math.pow(node.y - centroidY, 2))
      );
      const avgDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
      const glowRadius = Math.max(avgDistance * 1.5, 150); // Ensure minimum size
      
      // Draw the glow
      const color = nodes[0].color || getTopicColor(topic);
      const gradient = ctx.createRadialGradient(
        centroidX, centroidY, 0,
        centroidX, centroidY, glowRadius
      );
      
      gradient.addColorStop(0, `${color}20`); // Very light at center (12.5% opacity)
      gradient.addColorStop(0.6, `${color}10`); // Even lighter as it spreads (6.25% opacity)
      gradient.addColorStop(1, `${color}00`); // Transparent at the edges
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centroidX, centroidY, glowRadius, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [topicDensityMap, getTopicColor]);

  useEffect(() => {
    drawBackgroundGlow();
  }, [topicDensityMap, drawBackgroundGlow]);

  // Initialize and resize the background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const graphContainer = canvas.parentElement;
      if (!graphContainer) return;
      
      const { width, height } = graphContainer.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Redraw after resize
      drawBackgroundGlow();
    };
    
    // Initial size
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawBackgroundGlow]);

  // Initialize the force graph after graphData is set
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (graphRef.current && graphData.nodes.length > 0) {
      // Small delay to ensure the graph is fully initialized
      timeoutId = setTimeout(() => {
        try {
          // Get simulation from graph ref or handle null case
          const graph = graphRef.current;
          if (!graph || typeof graph.d3Force !== 'function') {
            console.warn("Graph or d3Force not available");
            return;
          }
          
          const simulation = graph.d3Force();
          if (!simulation) {
            console.warn("Force simulation not available");
            return;
          }
          
          // Set up center force first (as a foundation)
          simulation.force('center', d3.forceCenter());
          
          // Set up collision force with larger radius for more spacing
          simulation.force('collision', d3.forceCollide(70).strength(1.0)); // Increased radius and strength
          
          // Set up stronger charge force (repulsion) for more spacing
          simulation.force('charge', d3.forceManyBody().strength(-500).distanceMax(600)); // Significantly increased repulsion
          
          // Only configure link force if it exists - greater distance for more spacing
          if (simulation.force('link')) {
            simulation.force('link')
              .distance(200) // Increased from 150 to 200
              .strength(0.03); // Decreased further to make links even less rigid
          }
          
          // Restart with high alpha but delay to allow DOM to settle
          setTimeout(() => {
            try {
              simulation.alpha(0.5).restart();
            } catch (e) {
              console.warn("Error restarting simulation:", e);
            }
          }, 200);
          
          // Set up simple zoom handler
          const zoomHandler = graph.zoom();
          if (zoomHandler && typeof zoomHandler.on === 'function') {
            zoomHandler.on('zoom', (event: any) => {
              if (event && typeof event.k === 'number') {
                setZoomLevel(event.k);
              }
            });
          }
        } catch (error) {
          console.error("Error configuring force simulation:", error);
        }
      }, 100);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [graphData]);
  
  // Type guard to check if an object is a GraphNode
  const isGraphNode = (node: any): node is GraphNode => {
    return node && typeof node === 'object' && 'id' in node && 'type' in node;
  };
  
  // Helper function to safely get node ID regardless of format
  const getNodeId = (node: any): string | null => {
    if (!node) return null;
    if (typeof node === 'string') return node;
    if (typeof node === 'object' && node.id) return node.id;
    return null;
  };
  
  // Handle clicking on a node
  const handleNodeClick = useCallback((node: any) => {
    if (isGraphNode(node)) {
      setSelectedNode(node);
      
      // If it's a company node, navigate to the company page
      if (node.type === 'company') {
        navigate(`/company/${node.id}`);
      }
    }
  }, [navigate]);
  
  // Handle back to dashboard
  const handleBackClick = () => {
    navigate('/');
  };

  // Add custom topic function
  const addCustomTopic = () => {
    if (!customTopic.trim() || !currentTopic) return;
    
    // Create topic with a random color or use color picker selection
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    
    // Add to custom topics
    const newCustomTopics = {
      ...customTopics,
      [customTopic.toLowerCase()]: {
        name: customTopic,
        color: color,
        keywords: [customTopic.toLowerCase()]
      }
    };
    
    setCustomTopics(newCustomTopics);
    setCustomTopic('');
    
    // Also select this color for the current topic
    applyTopicColor(color);
  };

  // Add zoom-to-fit initialization
  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0 && !loading) {
      // Add small delay to ensure the graph is ready
      const timeoutId = setTimeout(() => {
        try {
          // Call the zoom-to-fit method
          graphRef.current.zoomToFit(500, 50);
        } catch (error) {
          console.error("Failed to zoom to fit:", error);
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [graphData.nodes.length, loading]);

  return (
    <div className="knowledge-center">
      <div className="top-bar-container">
        <TopBar title="Knowledge Center" />
      </div>
      
      <div className="knowledge-content">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Dashboard
        </button>
        
        <header className="knowledge-header">
          <h1>Virgin Group Knowledge Center</h1>
          <p>Explore connections between Virgin companies, projects, proposals, and collaborations</p>
        </header>
        
        <div className="legend-container">
          <div className="legend-section">
            <h3>Topic Colors</h3>
            <div className="legend-grid">
              {Object.entries({...TOPICS, ...customTopics}).map(([key, topic]) => (
                <div 
                  key={key} 
                  className="legend-item"
                  onClick={() => handleOpenColorPicker(key)}
                >
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: getTopicColor(key) }}
                  ></div>
                  <div className="legend-label">{topic.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="legend-shapes">
            <h3>Node Types</h3>
            <div className="shape-legend-grid">
              <div className="shape-legend-item">
                <div className="shape-company"></div>
                <div className="shape-label">Company</div>
              </div>
              <div className="shape-legend-item">
                <div className="shape-project"></div>
                <div className="shape-label">Project</div>
              </div>
              <div className="shape-legend-item">
                <div className="shape-collaboration"></div>
                <div className="shape-label">Collaboration</div>
              </div>
              <div className="shape-legend-item">
                <div className="shape-proposal"></div>
                <div className="shape-label">Proposal</div>
              </div>
            </div>
          </div>
          
          <div className="zoom-hint">
            <p>Hint: Zoom in to see more details or click on nodes to view information</p>
            <p>Click on topics to customize colors</p>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Building knowledge graph...</p>
          </div>
        ) : (
          <div className="graph-container">
            <canvas 
              ref={canvasRef} 
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />
            
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeRelSize={5}
              nodeCanvasObject={nodeCanvasObject}
              nodeLabel={(node: GraphNode) => `${node.name || ''}`}
              linkColor={(link: GraphLink) => {
                // Lighter, more subtle links
                const value = link.value || 0;
                return `rgba(180, 180, 180, ${Math.min(0.15 + value * 0.4, 0.6)})`;
              }}
              linkWidth={(link: GraphLink) => {
                // Only show links above threshold, with thinner lines
                const value = link.value || 0;
                return value > 0.75 ? Math.max(0.3, value * 2) : 0;
              }}
              onNodeClick={handleNodeClick}
              onZoom={transform => {
                handleZoom(transform);
                handleViewportChange(transform);
              }}
              onNodeDragEnd={() => calculateTopicDensity()}
              enableNodeDrag={true}
              enableZoomInteraction={true}
              minZoom={0.5}
              maxZoom={8}
              cooldownTime={3000}
              warmupTicks={30}
              cooldownTicks={30}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              backgroundColor="rgba(255,255,255,0)"
              width={window.innerWidth * 0.90}
              height={window.innerHeight * 0.75}
              enablePanInteraction={true} // Ensure pan is enabled
            />
          </div>
        )}
        
        {/* Viewport Summary */}
        {showSummary && (
          <div className="viewport-summary">
            <h3>Current View Summary</h3>
            <p>{viewportSummary}</p>
          </div>
        )}
        
        {selectedNode && (
          <div className="node-details-panel">
            <button className="close-panel-btn" onClick={() => setSelectedNode(null)}>×</button>
            <h2>{selectedNode.name}</h2>
            <div className="node-type-badge" style={{ backgroundColor: selectedNode.color }}>
              {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
              {selectedNode.category && ` - ${selectedNode.category.charAt(0).toUpperCase() + selectedNode.category.slice(1)}`}
            </div>
            
            <div className="node-topics">
              {selectedNode.topics && selectedNode.topics.map(topic => 
                TOPICS[topic] ? (
                  <span 
                    key={topic} 
                    className="topic-tag"
                    style={{ backgroundColor: TOPICS[topic]?.color || '#999', color: '#fff' }}
                  >
                    {TOPICS[topic]?.name || topic}
                  </span>
                ) : null
              )}
            </div>
            
            <p className="node-description">{selectedNode.description}</p>
            
            {selectedNode.type === 'project' && (
              <button 
                className="action-button"
                onClick={() => navigate(`/project/${selectedNode.id.replace('project-', '')}`)}
                style={{ backgroundColor: 'var(--primary-red)' }}
              >
                View Project Details
              </button>
            )}
            
            {selectedNode.type === 'collaboration' && (
              <button 
                className="action-button"
                onClick={() => navigate('/collaborate')}
                style={{ backgroundColor: 'var(--primary-red)' }}
              >
                View Collaboration
              </button>
            )}
            
            {selectedNode.type === 'company' && (
              <button 
                className="action-button"
                onClick={() => navigate(`/project/va-sustainable`)}
                style={{ backgroundColor: 'var(--primary-red)' }}
              >
                View Company Projects
              </button>
            )}
            
            {selectedNode.type === 'proposal' && (
              <button 
                className="action-button"
                onClick={() => navigate('/collaborate')}
                style={{ backgroundColor: 'var(--primary-red)' }}
              >
                View Proposal
              </button>
            )}
            
            <div className="related-nodes">
              <h3>Connected Nodes</h3>
              <ul>
                {graphData.links
                  .filter(link => {
                    const sourceId = getNodeId(link.source);
                    const targetId = getNodeId(link.target);
                    
                    return sourceId === selectedNode.id || targetId === selectedNode.id;
                  })
                  .map((link, index) => {
                    const sourceId = getNodeId(link.source);
                    const targetId = getNodeId(link.target);
                    
                    const connectedNodeId = sourceId === selectedNode.id ? targetId : sourceId;
                    const connectedNode = graphData.nodes.find(n => n.id === connectedNodeId);
                    
                    return connectedNode ? (
                      <li key={`${connectedNodeId}-${index}`}>
                        <a onClick={() => handleNodeClick(connectedNode)}>
                          <span className="connected-node-type" style={{ backgroundColor: connectedNode.color }}>
                            {connectedNode.type.charAt(0).toUpperCase()}
                          </span>
                          {connectedNode.name}
                        </a>
                      </li>
                    ) : null;
                  })
                }
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Color picker modal */}
      {showColorPicker && currentTopic && (
        <div className="color-picker-modal" onClick={() => setShowColorPicker(false)}>
          <div className="color-picker-content" onClick={e => e.stopPropagation()}>
            <div className="color-picker-header">
              <h3>Choose a color for {TOPICS[currentTopic]?.name || customTopics[currentTopic]?.name || currentTopic}</h3>
              <button className="color-picker-close" onClick={() => setShowColorPicker(false)}>×</button>
            </div>
            
            <div className="color-options">
              {colorOptions.map(color => (
                <div 
                  key={color}
                  className={`color-option ${getTopicColor(currentTopic) === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => applyTopicColor(color)}
                ></div>
              ))}
            </div>
            
            <div className="custom-topic-section">
              <div className="custom-topic-header">
                <h4>Add a custom topic to highlight</h4>
              </div>
              <div className="custom-topic-input">
                <input 
                  type="text" 
                  value={customTopic} 
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter a topic name" 
                />
                <button onClick={addCustomTopic}>Add</button>
              </div>
            </div>
            
            <div className="color-picker-actions">
              <button className="reset-color" onClick={resetTopicColor}>
                Reset to Default
              </button>
              <button className="apply-color" onClick={() => setShowColorPicker(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCenter; 