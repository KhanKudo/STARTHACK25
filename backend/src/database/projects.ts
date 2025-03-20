/// <reference types="node" />

import fs from 'fs';
import path from 'path';
import { Project } from '../types/project';
import { ProjectData } from './types';

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

// Add a new project
export function addProject(project: Omit<Project, 'id'>): Project {
  const projects = readProjects();
  const newProject: Project = {
    ...project,
    id: Math.random().toString(36).substr(2, 9),
  };
  projects.push(newProject);
  writeProjects(projects);
  return newProject;
}

// Update a project
export function updateProject(id: string, updates: Partial<Omit<Project, 'id'>>): Project | undefined {
  const projects = readProjects();
  const index = projects.findIndex(project => project.id === id);
  if (index === -1) return undefined;

  const updatedProject: Project = {
    ...projects[index],
    ...updates,
  };
  projects[index] = updatedProject;
  writeProjects(projects);
  return updatedProject;
}

// Delete a project
export function deleteProject(id: string): boolean {
  const projects = readProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  if (filteredProjects.length === projects.length) return false;
  writeProjects(filteredProjects);
  return true;
} 