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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private materials: Map<number, Material>;
  private projects: Map<number, Project>;
  private inquiries: Map<number, Inquiry>;
  private savedPlans: Map<number, SavedPlan>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.materials = new Map();
    this.projects = new Map();
    this.inquiries = new Map();
    this.savedPlans = new Map();
    this.currentId = {
      users: 1,
      packages: 1,
      materials: 1,
      projects: 1,
      inquiries: 1,
      savedPlans: 1,
    };

    // Initialize with sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Package operations
  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackageById(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getPackagesByFilter(filters: PackageFilters): Promise<Package[]> {
    let packages = Array.from(this.packages.values());

    if (filters.size && filters.size !== 'all') {
      packages = packages.filter((pkg) => {
        if (filters.size === 'small') return pkg.size <= 1000;
        if (filters.size === 'medium') return pkg.size > 1000 && pkg.size <= 2000;
        if (filters.size === 'large') return pkg.size > 2000;
        return true;
      });
    }

    if (filters.bhk && filters.bhk !== 'all') {
      packages = packages.filter((pkg) => {
        if (filters.bhk === '4+') return pkg.bedrooms >= 4;
        return pkg.bedrooms === parseInt(filters.bhk!);
      });
    }

    if (filters.style && filters.style !== 'all') {
      packages = packages.filter((pkg) => 
        pkg.style.toLowerCase() === filters.style!.toLowerCase()
      );
    }

    if (filters.budget && filters.budget !== 'all') {
      packages = packages.filter((pkg) => {
        const price = pkg.price / 100000; // Convert to lakhs
        if (filters.budget === '15-20') return price >= 15 && price <= 20;
        if (filters.budget === '20-30') return price > 20 && price <= 30;
        if (filters.budget === '30-50') return price > 30 && price <= 50;
        if (filters.budget === '50+') return price > 50;
        return true;
      });
    }

    return packages;
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = this.currentId.packages++;
    const pkg: Package = { ...insertPackage, id };
    this.packages.set(id, pkg);
    return pkg;
  }

  // Material operations
  async getAllMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values());
  }

  async getMaterialsByCategory(category: string): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(
      (material) => category === 'all' || material.category === category
    );
  }

  async getMaterialById(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = this.currentId.materials++;
    const material: Material = { ...insertMaterial, id };
    this.materials.set(id, material);
    return material;
  }

  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId.projects++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // Inquiry operations
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentId.inquiries++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id,
      createdAt: new Date() 
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  // Saved plans operations
  async getSavedPlansBySessionId(sessionId: string): Promise<SavedPlan[]> {
    return Array.from(this.savedPlans.values()).filter(
      (plan) => plan.sessionId === sessionId
    );
  }

  async createSavedPlan(insertPlan: InsertSavedPlan): Promise<SavedPlan> {
    const id = this.currentId.savedPlans++;
    const plan: SavedPlan = { 
      ...insertPlan, 
      id,
      createdAt: new Date() 
    };
    this.savedPlans.set(id, plan);
    return plan;
  }

  async deleteSavedPlan(id: number): Promise<boolean> {
    return this.savedPlans.delete(id);
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

  // Initialize with sample data
  private initializeSampleData() {
    // Sample packages
    this.createPackage({
      name: "Modern 2BHK Villa",
      nameHindi: "आधुनिक 2BHK विला",
      description: "A contemporary 2BHK villa with open floor plan, premium finishes and modern amenities.",
      descriptionHindi: "ओपन फ्लोर प्लान, प्रीमियम फिनिश और आधुनिक सुविधाओं के साथ एक समकालीन 2BHK विला।",
      size: 1200,
      bedrooms: 2,
      bathrooms: 2,
      price: 2500000, // 25 lakhs
      style: "modern",
      popular: true,
      premium: false,
      budget: false,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
    });

    this.createPackage({
      name: "Luxury 3BHK Villa",
      nameHindi: "लक्जरी 3BHK विला",
      description: "A luxurious 3BHK villa with high ceilings, premium materials, and spacious rooms.",
      descriptionHindi: "ऊंची छतों, प्रीमियम सामग्रियों और विशाल कमरों के साथ एक शानदार 3BHK विला।",
      size: 1800,
      bedrooms: 3,
      bathrooms: 3,
      price: 3800000, // 38 lakhs
      style: "contemporary",
      popular: false,
      premium: true,
      budget: false,
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
    });

    this.createPackage({
      name: "Compact 1BHK Home",
      nameHindi: "कॉम्पैक्ट 1BHK होम",
      description: "A smart and efficient 1BHK home with modern amenities and quality finishes.",
      descriptionHindi: "आधुनिक सुविधाओं और गुणवत्तापूर्ण फिनिश के साथ एक स्मार्ट और कुशल 1BHK घर।",
      size: 600,
      bedrooms: 1,
      bathrooms: 1,
      price: 1500000, // 15 lakhs
      style: "minimalist",
      popular: false,
      premium: false,
      budget: true,
      imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
    });

    // Sample materials
    this.createMaterial({
      name: "Italian Marble",
      nameHindi: "इटालियन मार्बल",
      category: "flooring",
      description: "Premium Italian marble for elegant flooring solutions.",
      descriptionHindi: "सुरुचिपूर्ण फर्श समाधान के लिए प्रीमियम इटालियन संगमरमर।",
      premium: true,
      imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
    });

    this.createMaterial({
      name: "Engineered Wood",
      nameHindi: "इंजीनियर्ड वुड",
      category: "flooring",
      description: "Durable engineered wood flooring for a warm, natural look.",
      descriptionHindi: "गर्म, प्राकृतिक लुक के लिए टिकाऊ इंजीनियर्ड वुड फ्लोरिंग।",
      premium: false,
      imageUrl: "https://images.unsplash.com/photo-1620641622500-696fc056faf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
    });

    this.createMaterial({
      name: "Granite Countertop",
      nameHindi: "ग्रेनाइट काउंटरटॉप",
      category: "kitchen",
      description: "Premium granite countertops for kitchen surfaces.",
      descriptionHindi: "रसोई की सतहों के लिए प्रीमियम ग्रेनाइट काउंटरटॉप।",
      premium: true,
      imageUrl: "https://images.unsplash.com/photo-1622128979476-c1c303cc05cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
    });

    this.createMaterial({
      name: "Designer Tiles",
      nameHindi: "डिजाइनर टाइल्स",
      category: "bathroom",
      description: "Stylish designer tiles for bathroom and kitchen spaces.",
      descriptionHindi: "बाथरूम और रसोई के स्थानों के लिए स्टाइलिश डिजाइनर टाइल।",
      premium: false,
      imageUrl: "https://images.unsplash.com/photo-1609235435104-943084ab3d68?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
    });

    this.createMaterial({
      name: "Textured Paint",
      nameHindi: "टेक्सचर्ड पेंट",
      category: "walls",
      description: "Elegant textured paint for distinctive wall finishes.",
      descriptionHindi: "विशिष्ट दीवार फिनिश के लिए सुरुचिपूर्ण टेक्सचर्ड पेंट।",
      premium: true,
      imageUrl: "https://images.unsplash.com/photo-1583364444622-8d3ebdfe38dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
    });

    this.createMaterial({
      name: "Hardwood Doors",
      nameHindi: "हार्डवुड दरवाजे",
      category: "doors",
      description: "Premium hardwood doors for elegance and durability.",
      descriptionHindi: "सुरुचि और टिकाऊपन के लिए प्रीमियम हार्डवुड दरवाजे।",
      premium: true,
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
    });

    // Sample projects
    this.createProject({
      title: "Modern Villa, Delhi",
      titleHindi: "आधुनिक विला, दिल्ली",
      subtitle: "3BHK Luxury Home",
      subtitleHindi: "3BHK लक्जरी होम",
      description: "A contemporary design with open floor plan, large windows and premium finishes throughout.",
      descriptionHindi: "ओपन फ्लोर प्लान, बड़ी खिड़कियों और प्रीमियम फिनिश के साथ एक समकालीन डिज़ाइन।",
      completed: true,
      location: "Delhi",
      imageUrl: "https://images.unsplash.com/photo-1580913428023-02c695666d61?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
    });

    this.createProject({
      title: "Traditional Home, Mumbai",
      titleHindi: "पारंपरिक घर, मुंबई",
      subtitle: "4BHK Family House",
      subtitleHindi: "4BHK फैमिली हाउस",
      description: "A blend of traditional elements with modern amenities, featuring spacious rooms and elegant detailing.",
      descriptionHindi: "आधुनिक सुविधाओं के साथ पारंपरिक तत्वों का मिश्रण, विशाल कमरों और सुंदर डिटेलिंग के साथ।",
      completed: true,
      location: "Mumbai",
      imageUrl: "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
    });

    this.createProject({
      title: "Minimalist Home, Bangalore",
      titleHindi: "मिनिमलिस्ट होम, बैंगलोर",
      subtitle: "2BHK Smart Home",
      subtitleHindi: "2BHK स्मार्ट होम",
      description: "A minimalist design focused on functionality and clean aesthetics with smart home integration.",
      descriptionHindi: "स्मार्ट होम इंटीग्रेशन के साथ कार्यक्षमता और साफ सौंदर्य पर केंद्रित एक मिनिमलिस्ट डिज़ाइन।",
      completed: true,
      location: "Bangalore",
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
    });
  }
}

export const storage = new MemStorage();
