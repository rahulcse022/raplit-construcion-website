import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { v4 as uuidv4 } from "uuid";
import { InsertSavedPlan } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "./LanguageContext";

interface SavedPlan {
  packageId?: number;
  customPackage?: any;
}

interface SavedPlansContextType {
  savedPlans: SavedPlan[];
  savePlan: (plan: SavedPlan) => void;
  removePlan: (index: number) => void;
  clearPlans: () => void;
}

const SavedPlansContext = createContext<SavedPlansContextType | undefined>(undefined);

export const SavedPlansProvider = ({ children }: { children: ReactNode }) => {
  // Safely try to use language context, fallback to simple translation function if not available
  let t: (key: string) => string;
  try {
    const languageContext = useLanguage();
    t = languageContext.t;
  } catch (error) {
    // Fallback translation function
    t = (key: string) => {
      const lastPart = key.split('.').pop() || '';
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    };
  }
  
  const { toast } = useToast();
  
  // Get or create a unique session ID for the user
  const [sessionId] = useState<string>(() => {
    const existingId = localStorage.getItem("bmh_session_id");
    if (existingId) return existingId;
    
    const newId = uuidv4();
    localStorage.setItem("bmh_session_id", newId);
    return newId;
  });
  
  // Load saved plans from localStorage
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    const savedPlansData = localStorage.getItem("bmh_saved_plans");
    return savedPlansData ? JSON.parse(savedPlansData) : [];
  });
  
  // Save plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bmh_saved_plans", JSON.stringify(savedPlans));
  }, [savedPlans]);
  
  // API call to save plan (only calls API if we have a real backend)
  const { mutate: savePlanToServer } = useMutation({
    mutationFn: async (plan: InsertSavedPlan) => {
      const response = await apiRequest("POST", "/api/saved-plans", plan);
      return response.json();
    },
    onError: (error) => {
      console.error("Failed to save plan to server:", error);
      // We continue with the local storage approach even if the API fails
    },
  });
  
  // API call to delete plan
  const { mutate: deletePlanFromServer } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/saved-plans/${id}`);
    },
    onError: (error) => {
      console.error("Failed to delete plan from server:", error);
      // We continue with the local storage approach even if the API fails
    },
  });
  
  // Add a new plan to saved plans
  const savePlan = (plan: SavedPlan) => {
    // Check if this plan already exists
    const exists = savedPlans.some(p => 
      (plan.packageId && p.packageId === plan.packageId) ||
      (plan.customPackage && p.customPackage && 
       p.customPackage.landArea === plan.customPackage.landArea &&
       p.customPackage.floors === plan.customPackage.floors &&
       p.customPackage.houseType === plan.customPackage.houseType)
    );
    
    if (exists) {
      toast({
        title: t("savedPlans.alreadySaved"),
        description: t("savedPlans.alreadySavedDescription"),
      });
      return;
    }
    
    // Add plan to local state
    setSavedPlans([...savedPlans, plan]);
    
    // Try to save to server if possible
    savePlanToServer({
      sessionId,
      packageId: plan.packageId,
      customPackage: plan.customPackage,
    });
    
    toast({
      title: t("savedPlans.planSaved"),
      description: t("savedPlans.planSavedDescription"),
    });
  };
  
  // Remove a plan at the given index
  const removePlan = (index: number) => {
    if (index < 0 || index >= savedPlans.length) return;
    
    // Create a copy of the array without the plan to remove
    const newPlans = [...savedPlans];
    newPlans.splice(index, 1);
    setSavedPlans(newPlans);
    
    // We don't have a server-side ID to delete, so we can't call the API
    // If we had server-side IDs, we would call deletePlanFromServer(id)
    
    toast({
      title: t("savedPlans.planRemoved"),
      description: t("savedPlans.planRemovedDescription"),
    });
  };
  
  // Clear all saved plans
  const clearPlans = () => {
    setSavedPlans([]);
    localStorage.removeItem("bmh_saved_plans");
    
    toast({
      title: t("savedPlans.allPlansCleared"),
      description: t("savedPlans.allPlansClearedDescription"),
    });
  };
  
  return (
    <SavedPlansContext.Provider
      value={{
        savedPlans,
        savePlan,
        removePlan,
        clearPlans,
      }}
    >
      {children}
    </SavedPlansContext.Provider>
  );
};

export const useSavedPlans = (): SavedPlansContextType => {
  const context = useContext(SavedPlansContext);
  if (context === undefined) {
    throw new Error("useSavedPlans must be used within a SavedPlansProvider");
  }
  return context;
};
