import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users for authentication (future enhancement)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Home packages
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi").notNull(),
  description: text("description").notNull(),
  descriptionHindi: text("description_hindi").notNull(),
  size: integer("size").notNull(), // in square feet
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  price: integer("price").notNull(), // in rupees
  style: text("style").notNull(), // modern, traditional, etc.
  popular: boolean("popular").default(false),
  premium: boolean("premium").default(false),
  budget: boolean("budget").default(false),
  imageUrl: text("image_url").notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({ id: true });

// Materials categories and options
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi").notNull(),
  category: text("category").notNull(), // flooring, walls, kitchen, bathroom, etc.
  description: text("description").notNull(),
  descriptionHindi: text("description_hindi").notNull(),
  premium: boolean("premium").default(false),
  imageUrl: text("image_url").notNull(),
});

export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true });

// Portfolio projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleHindi: text("title_hindi").notNull(),
  subtitle: text("subtitle").notNull(),
  subtitleHindi: text("subtitle_hindi").notNull(),
  description: text("description").notNull(),
  descriptionHindi: text("description_hindi").notNull(),
  completed: boolean("completed").default(true),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });

// Customer inquiries
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  location: text("location"),
  requirements: text("requirements"),
  customPackage: jsonb("custom_package"), // For storing customized home details
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({ 
  id: true,
  createdAt: true,
});

// SavedPlans for users to keep track of favorite or customized plans
export const savedPlans = pgTable("saved_plans", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(), // To identify users without login
  packageId: integer("package_id"), // If based on an existing package
  customPackage: jsonb("custom_package"), // For storing customized home details
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSavedPlanSchema = createInsertSchema(savedPlans).omit({ 
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type SavedPlan = typeof savedPlans.$inferSelect;
export type InsertSavedPlan = z.infer<typeof insertSavedPlanSchema>;

// Custom types for the builder
export type HouseType = 'modern' | 'traditional' | 'contemporary' | 'minimalist';
export type InteriorType = 'basic' | 'premium' | 'luxury';
export type BudgetRange = '15-20' | '20-30' | '30-50' | '50-75' | '75-100' | '100+';

export type CustomHomeDetails = {
  landArea: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  houseType: HouseType;
  budgetRange: BudgetRange;
  interiorType?: InteriorType;
  materials?: {
    flooring?: string;
    walls?: string;
    kitchen?: string;
    bathroom?: string;
    doors?: string;
    windows?: string;
  };
  estimatedCost?: number;
};
