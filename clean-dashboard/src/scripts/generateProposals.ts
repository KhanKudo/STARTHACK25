import { COMPANY_DATA } from '../utils/companyData';
import { projectData } from '../utils/projectData';
import { generateAIProposals } from '../services/proposalGenerator';
import fs from 'fs';
import path from 'path';

async function updateProposalData() {
  try {
    // Generate new AI proposals
    const newProposals = await generateAIProposals({
      companies: COMPANY_DATA,
      projects: projectData
    });

    // Read existing proposals
    const proposalDataPath = path.join(__dirname, '../utils/proposalData.ts');
    const proposalDataContent = fs.readFileSync(proposalDataPath, 'utf-8');

    // Extract existing proposals array
    const existingProposalsMatch = proposalDataContent.match(/export const EXAMPLE_PROPOSALS: Proposal\[\] = \[([\s\S]*?)\];/);
    if (!existingProposalsMatch) {
      throw new Error('Could not find existing proposals in file');
    }

    // Convert new proposals to string format
    const newProposalsString = newProposals.map(proposal => `
  {
    id: 'ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}',
    title: '${proposal.title}',
    company: '${proposal.company}',
    category: '${proposal.category}',
    description: '${proposal.description}',
    impact: ${JSON.stringify(proposal.impact)},
    tags: ${JSON.stringify(proposal.tags)},
    votes: 0,
    isRecommended: ${proposal.isRecommended},
    source: 'ai',
    createdAt: '${new Date().toISOString()}',
    status: 'active'
  }`).join(',');

    // Create new content with updated proposals
    const newContent = proposalDataContent.replace(
      /export const EXAMPLE_PROPOSALS: Proposal\[\] = \[([\s\S]*?)\];/,
      `export const EXAMPLE_PROPOSALS: Proposal[] = [${existingProposalsMatch[1]},${newProposalsString}];`
    );

    // Write back to file
    fs.writeFileSync(proposalDataPath, newContent);

    console.log('Successfully updated proposal data with new AI-generated proposals');
  } catch (error) {
    console.error('Error updating proposal data:', error);
  }
}

// Run the update
updateProposalData(); 