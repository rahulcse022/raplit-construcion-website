import { v4 as uuidv4 } from 'uuid';
import {
  User, InsertUser,
  Package, InsertPackage,
  Material, InsertMaterial,
  Project, InsertProject,
  Inquiry, InsertInquiry,
  SavedPlan, InsertSavedPlan,
  CustomHomeDetails
} from "@shared/schema";
import { MongoClient, ObjectId } from 'mongodb';
import { connectDB, collections, disconnect } from './db';


export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Package operations
  getAllPackages(): Promise<Package[]>;
  getPackageById(id: number): Promise<Package | undefined>;
  getPackagesByFilter(filters: PackageFilters): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;

  // Material operations
  getAllMaterials(): Promise<Material[]>;
  getMaterialsByCategory(category: string): Promise<Material[]>;
  getMaterialById(id: number): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;

  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;

  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;

  // Saved plans operations
  getSavedPlansBySessionId(sessionId: string): Promise<SavedPlan[]>;
  createSavedPlan(plan: InsertSavedPlan): Promise<SavedPlan>;
  deleteSavedPlan(id: number): Promise<boolean>;

  // Cost estimation
  calculateEstimatedCost(details: CustomHomeDetails): Promise<number>;
}

// Filter types
export interface PackageFilters {
  size?: 'small' | 'medium' | 'large' | 'all';
  bhk?: '1' | '2' | '3' | '4+' | 'all';
  style?: string;
  budget?: string;
}

export class MongoStorage implements IStorage {

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async createUser(user: InsertUser): Promise<User> {
    throw new Error("Method not implemented.");
  }

  // Package operations
  async getAllPackages(): Promise<Package[]> {
    return await collections.packages.find({}).toArray();
  }
  async getPackageById(id: number): Promise<Package | undefined> {
    return await collections.packages.findOne({ id });
  }
  async getPackagesByFilter(filters: PackageFilters): Promise<Package[]> {
    let query: any = {};
    if (filters.size && filters.size !== 'all') {
      if (filters.size === 'small') query.size = { $lte: 1000 };
      else if (filters.size === 'medium') query.size = { $gt: 1000, $lte: 2000 };
      else if (filters.size === 'large') query.size = { $gt: 2000 };
    }
    if (filters.bhk && filters.bhk !== 'all') {
      if (filters.bhk === '4+') query.bedrooms = { $gte: 4 };
      else query.bedrooms = parseInt(filters.bhk);
    }
    if (filters.style && filters.style !== 'all') {
      query.style = filters.style;
    }
    if (filters.budget && filters.budget !== 'all') {
      const [min, max] = filters.budget.split('-').map(Number);
      query.price = { $gte: min * 100000, $lte: max * 100000 };
    }

    return await collections.packages.find(query).toArray();
  }
  async createPackage(pkg: InsertPackage): Promise<Package> {
    const result = await collections.packages.insertOne(pkg);
    return { ...pkg, id: result.insertedId as number };
  }

  // Material operations
  async getAllMaterials(): Promise<Material[]> {
    return await collections.materials.find({}).toArray();
  }
  async getMaterialsByCategory(category: string): Promise<Material[]> {
    return await collections.materials.find({ category: category === 'all' ? { $exists: true } : category }).toArray();
  }
  async getMaterialById(id: number): Promise<Material | undefined> {
    return await collections.materials.findOne({ id });
  }
  async createMaterial(material: InsertMaterial): Promise<Material> {
    const result = await collections.materials.insertOne(material);
    return { ...material, id: result.insertedId as number };
  }

  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return await collections.projects.find({}).toArray();
  }
  async getProjectById(id: number): Promise<Project | undefined> {
    return await collections.projects.findOne({ id });
  }
  async createProject(project: InsertProject): Promise<Project> {
    const result = await collections.projects.insertOne(project);
    return { ...project, id: result.insertedId as number };
  }

  // Inquiry operations
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    throw new Error("Method not implemented.");
  }
  async getAllInquiries(): Promise<Inquiry[]> {
    throw new Error("Method not implemented.");
  }

  // Saved plans operations
  async getSavedPlansBySessionId(sessionId: string): Promise<SavedPlan[]> {
    return await collections.savedPlans.find({ sessionId }).toArray();
  }
  async createSavedPlan(plan: InsertSavedPlan): Promise<SavedPlan> {
    const result = await collections.savedPlans.insertOne({...plan, createdAt: new Date()});
    return {...plan, id: result.insertedId as number, createdAt: new Date()};
  }
  async deleteSavedPlan(id: number): Promise<boolean> {
    const result = await collections.savedPlans.deleteOne({id});
    return result.deletedCount > 0;
  }


  // Cost estimation
  async calculateEstimatedCost(details: CustomHomeDetails): Promise<number> {
    // Basic calculation based on size, type and number of rooms
    let baseCost = details.landArea * 2000; // Rs 2000 per sq ft base cost

    // Adjust for number of floors
    baseCost *= (1 + (details.floors - 1) * 0.2); // 20% increase per additional floor

    // Adjust for house type
    switch (details.houseType) {
      case 'modern':
        baseCost *= 1.1; // 10% premium
        break;
      case 'traditional':
        baseCost *= 1.0; // standard
        break;
      case 'contemporary':
        baseCost *= 1.15; // 15% premium
        break;
      case 'minimalist':
        baseCost *= 0.95; // 5% discount
        break;
    }

    // Adjust for interior type if specified
    if (details.interiorType) {
      switch (details.interiorType) {
        case 'basic':
          baseCost *= 1.0; // standard
          break;
        case 'premium':
          baseCost *= 1.2; // 20% premium
          break;
        case 'luxury':
          baseCost *= 1.4; // 40% premium
          break;
      }
    }

    // Round to nearest 1000
    return Math.round(baseCost / 1000) * 1000;
  }
}

export const storage = new MongoStorage();