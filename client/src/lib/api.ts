
import { packages, materials, projects } from './mockData';

export const getPackages = (filters = {}) => {
  return Promise.resolve(packages);
};

export const getMaterials = (category?: string) => {
  if (category) {
    return Promise.resolve(materials.filter(m => m.category === category));
  }
  return Promise.resolve(materials);
};

export const getProjects = () => {
  return Promise.resolve(projects);
};

export const getProjectById = (id: number) => {
  const project = projects.find(p => p.id === id);
  return Promise.resolve(project);
};
