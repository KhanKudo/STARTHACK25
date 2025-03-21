import { Company, COMPANY_DATA } from '../utils/companyData';
import { Project, projectData } from '../utils/projectData';
import { Proposal, proposalData, addProposal } from '../utils/proposalData';
import { generateProposal } from './deepseekService';

export interface ProposalGenerationContext {
  companies: Company[];
  projects: Project[];
}

export interface GeneratedProposal extends Omit<Proposal, 'id' | 'votes' | 'status' | 'createdAt'> {
  source: 'user' | 'ai';
}

export async function generateAIProposals(context: ProposalGenerationContext): Promise<GeneratedProposal[]> {
  const { companies, projects } = context;
  const generatedProposals: GeneratedProposal[] = [];

  // Generate company-based proposals
  for (const company of companies) {
    const companyProjects = projects.filter(p => p.company === company.name);
    
    try {
      const proposal = await generateProposal({
        company,
        projects: companyProjects,
        type: 'company'
      });
      
      // Add proposal to the generated list
      generatedProposals.push(proposal);
      
      // Append to proposalData through the addProposal function
      addProposal({
        ...proposal,
        votes: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error(`Failed to generate proposal for company ${company.name}:`, error);
    }
  }

  // Generate project-based proposals for each project
  for (const project of projects) {
    const company = companies.find(c => c.name === project.company);
    
    if (company) {
      try {
        const proposal = await generateProposal({
          company,
          project,
          type: 'project'
        });
        
        // Add proposal to the generated list
        generatedProposals.push(proposal);
        
        // Append to proposalData through the addProposal function
        addProposal({
          ...proposal,
          votes: 0,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        console.error(`Failed to generate proposal for project ${project.initiative}:`, error);
        
        // Use fallback content if generation fails
        const fallbackProposal: GeneratedProposal = {
          title: `Improve ${project.initiative}`,
          description: `A practical approach to enhance ${project.initiative} with sustainable methods.`,
          company: company.name,
          category: ['carbon', 'water', 'biodiversity', 'social', 'circular'][Math.floor(Math.random() * 5)] as 'carbon' | 'water' | 'biodiversity' | 'social' | 'circular',
          impact: [{ metric: 'Sustainability', value: 'Medium-High Impact' }],
          tags: ['innovation', 'sustainability', 'improvement'],
          source: 'ai',
          isRecommended: false
        };
        
        generatedProposals.push(fallbackProposal);
      }
    }
  }

  return generatedProposals;
} 