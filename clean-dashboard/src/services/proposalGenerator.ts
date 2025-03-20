import { Company } from '../utils/companyData';
import { Project } from '../utils/projectData';
import { Proposal } from '../utils/proposalData';
import { generateProposal } from './deepseekService';

export interface ProposalGenerationContext {
  companies: Company[];
  projects: Project[];
}

export interface GeneratedProposal extends Omit<Proposal, 'id' | 'votes' | 'status' | 'createdAt'> {
  source: 'user' | 'ai';
}

/*
export async function generateAIProposals(context: ProposalGenerationContext): Promise<GeneratedProposal[]> {
  const combinedProposals = [
    ...context.companies.map(company => ({
      type: 'company' as const,
      company,
      projects: context.projects.filter(p => p.company === company.name)
    })),
    ...context.projects.map(project => ({
      type: 'project' as const,
      company: context.companies.find(c => c.name === project.company)!,
      project
    }))
  ];

  // If all proposals have been activated, srun node-tstart from the beginning
  // const currentProposal = combinedProposals[proposalIndex % combinedProposals.length];
  //proposalIndex++;

  // Generate the current proposal
  // const generatedProposal = await generateProposal(currentProposal);
  // proposals.push(generatedProposal);

  return await generateProposal(currentProposal);
} */