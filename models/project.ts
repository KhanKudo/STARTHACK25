export interface Project {
    id: string;
    company: string;
    initiative: string;
    challenge: string;
    description?: string;
    callToAction?: string;
    links?: string[];
    imageUrl: string;
}