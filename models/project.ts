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
}