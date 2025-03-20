export interface Project {
    id: string;
    company: string;
    initiative: string;
    challenge: string;
    description?: string;
    callToAction?: string;
    location?: [number, number];
    links?: string[];
    imageUrl: string;
    status?: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
    category?: 'research' | 'infrastructure' | 'sustainability' | 'digital' | 'process';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    timeline?: 'short-term' | 'medium-term' | 'long-term';
    impactAreas?: ('carbon' | 'water' | 'waste' | 'energy' | 'biodiversity')[];
    completionPercentage?: number;
    estimatedReduction?: number;
    tags?: string[];
}