export interface Project {
  id: string;
  company: string;
  initiative: string;
  challenge: string;
  description?: string;
  imageUrl: string;
  callToAction?: string;
  links?: string[];
} 