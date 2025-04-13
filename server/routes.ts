import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertSavedPlanSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  
  // Middleware for API routes
  apiRouter.use(express.json());
  
  // Return all packages or filtered packages
  apiRouter.get("/packages", async (req, res) => {
    try {
      const { size, bhk, style, budget } = req.query;
      
      if (Object.keys(req.query).length === 0) {
        // No filters, return all packages
        const packages = await storage.getAllPackages();
        return res.json(packages);
      }
      
      // Apply filters
      const packages = await storage.getPackagesByFilter({
        size: size as any,
        bhk: bhk as any,
        style: style as string,
        budget: budget as string
      });
      
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  
  // Get a single package by ID
  apiRouter.get("/packages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackageById(id);
      
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json(pkg);
    } catch (error) {
      console.error("Error fetching package:", error);
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });
  
  // Get all materials or by category
  apiRouter.get("/materials", async (req, res) => {
    try {
      const { category } = req.query;
      
      if (category) {
        const materials = await storage.getMaterialsByCategory(category as string);
        return res.json(materials);
      }
      
      const materials = await storage.getAllMaterials();
      res.json(materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });
  
  // Get a single material by ID
  apiRouter.get("/materials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const material = await storage.getMaterialById(id);
      
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }
      
      res.json(material);
    } catch (error) {
      console.error("Error fetching material:", error);
      res.status(500).json({ message: "Failed to fetch material" });
    }
  });
  
  // Get all projects
  apiRouter.get("/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  // Get a single project by ID
  apiRouter.get("/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProjectById(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  
  // Submit an inquiry
  apiRouter.post("/inquiries", async (req, res) => {
    try {
      const inquiry = insertInquirySchema.parse(req.body);
      const createdInquiry = await storage.createInquiry(inquiry);
      res.status(201).json(createdInquiry);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });
  
  // Calculate estimated cost based on custom home details
  apiRouter.post("/calculate-cost", async (req, res) => {
    try {
      // Create a schema for the request body
      const schema = z.object({
        landArea: z.number().min(100),
        floors: z.number().min(1).max(10),
        bedrooms: z.number().min(1),
        bathrooms: z.number().min(1),
        houseType: z.enum(['modern', 'traditional', 'contemporary', 'minimalist']),
        budgetRange: z.enum(['15-20', '20-30', '30-50', '50-75', '75-100', '100+']).optional(),
        interiorType: z.enum(['basic', 'premium', 'luxury']).optional(),
        materials: z.object({
          flooring: z.string().optional(),
          walls: z.string().optional(),
          kitchen: z.string().optional(),
          bathroom: z.string().optional(),
          doors: z.string().optional(),
          windows: z.string().optional(),
        }).optional(),
      });
      
      const details = schema.parse(req.body);
      const estimatedCost = await storage.calculateEstimatedCost(details);
      
      res.json({ estimatedCost });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error calculating cost:", error);
      res.status(500).json({ message: "Failed to calculate cost" });
    }
  });
  
  // Get saved plans by session ID
  apiRouter.get("/saved-plans/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      const savedPlans = await storage.getSavedPlansBySessionId(sessionId);
      res.json(savedPlans);
    } catch (error) {
      console.error("Error fetching saved plans:", error);
      res.status(500).json({ message: "Failed to fetch saved plans" });
    }
  });
  
  // Create a saved plan
  apiRouter.post("/saved-plans", async (req, res) => {
    try {
      const savedPlan = insertSavedPlanSchema.parse(req.body);
      const createdSavedPlan = await storage.createSavedPlan(savedPlan);
      res.status(201).json(createdSavedPlan);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating saved plan:", error);
      res.status(500).json({ message: "Failed to create saved plan" });
    }
  });
  
  // Delete a saved plan
  apiRouter.delete("/saved-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSavedPlan(id);
      
      if (!success) {
        return res.status(404).json({ message: "Saved plan not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting saved plan:", error);
      res.status(500).json({ message: "Failed to delete saved plan" });
    }
  });

  // Mount the API router at /api
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
