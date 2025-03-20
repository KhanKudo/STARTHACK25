/// <reference types="node" />

import fs from 'fs';
import path from 'path';
import { Project, ProjectData } from './types';

const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize projects file if it doesn't exist
if (!fs.existsSync(PROJECTS_FILE)) {
  const initialData: ProjectData = { projects: [] };
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialData, null, 2));
}

// Read projects from file
function readProjects(): Project[] {
  const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
  const projectData: ProjectData = JSON.parse(data);
  return projectData.projects;
}

// Write projects to file
function writeProjects(projects: Project[]): void {
  const projectData: ProjectData = { projects };
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projectData, null, 2));
}

// Get all projects
export function getAllProjects(): Project[] {
  return readProjects();
}

// Get project by ID
export function getProjectById(id: string): Project | undefined {
  const projects = readProjects();
  return projects.find(project => project.id === id);
}

// Add new project
export function addProject(project: Omit<Project, 'id'>): Project {
  // Generate ID from company and initiative (simplified slug)
  const slug = project.company
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
    .substring(0, 10);
  
  const initiative = project.initiative
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
    .substring(0, 10);
  
  // Generate a unique ID
  const timestamp = Date.now().toString(36);
  const id = `${slug}-${initiative}-${timestamp}`;
  
  // Create the new project with the ID
  const newProject: Project = {
    id,
    ...project
  };
  
  // Read current projects
  const projects = readProjects();
  
  // Add new project to the beginning of the array
  projects.unshift(newProject);
  
  // Write updated projects back to file
  writeProjects(projects);
  
  return newProject;
}

// Update project
export function updateProject(id: string, updates: Partial<Omit<Project, 'id'>>): Project | undefined {
  const projects = readProjects();
  const index = projects.findIndex(project => project.id === id);
  
  if (index === -1) {
    return undefined;
  }
  
  // Update the project while preserving its ID
  projects[index] = {
    ...projects[index],
    ...updates
  };
  
  writeProjects(projects);
  return projects[index];
}

// Delete project
export function deleteProject(id: string): boolean {
  const projects = readProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  
  if (filteredProjects.length === projects.length) {
    return false;
  }
  
  writeProjects(filteredProjects);
  return true;
} 