import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CustomHomeDetails, HouseType, BudgetRange, InteriorType } from "@shared/schema";

interface BuilderContextType {
  homeDetails: CustomHomeDetails;
  estimatedCost: number;
  setHomeDetails: (details: CustomHomeDetails) => void;
  calculateEstimate: (details: CustomHomeDetails) => void;
  resetHomeDetails: () => void;
}

// Initial state for the builder
const initialHomeDetails: CustomHomeDetails = {
  landArea: 1000,
  floors: 1,
  bedrooms: 2,
  bathrooms: 2,
  houseType: "modern",
  budgetRange: "20-30",
  interiorType: "basic",
  materials: {},
  estimatedCost: 2000000, // 20 Lakhs default
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider = ({ children }: { children: ReactNode }) => {
  const [homeDetails, setHomeDetailsState] = useState<CustomHomeDetails>(() => {
    // Try to load saved state from sessionStorage
    const savedState = sessionStorage.getItem("homeBuilderDetails");
    return savedState ? JSON.parse(savedState) : initialHomeDetails;
  });
  
  const [estimatedCost, setEstimatedCost] = useState<number>(() => {
    const savedState = sessionStorage.getItem("homeBuilderDetails");
    return savedState ? JSON.parse(savedState).estimatedCost || 2000000 : 2000000;
  });

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("homeBuilderDetails", JSON.stringify(homeDetails));
  }, [homeDetails]);

  // Mutation for calculating cost estimate
  const { mutate: calculateCostMutation } = useMutation({
    mutationFn: async (details: CustomHomeDetails) => {
      const response = await apiRequest("POST", "/api/calculate-cost", details);
      return response.json();
    },
    onSuccess: (data) => {
      setEstimatedCost(data.estimatedCost);
      setHomeDetailsState((prev) => ({
        ...prev,
        estimatedCost: data.estimatedCost,
      }));
    },
    onError: (error) => {
      console.error("Error calculating cost estimate:", error);
      // Fallback to a simple calculation if API fails
      const baseCost = (details.landArea || 1000) * 2000;
      const floorMultiplier = 1 + ((details.floors || 1) - 1) * 0.2;
      let typeMultiplier = 1.0;
      
      switch (details.houseType) {
        case "modern": typeMultiplier = 1.1; break;
        case "traditional": typeMultiplier = 1.0; break;
        case "contemporary": typeMultiplier = 1.15; break;
        case "minimalist": typeMultiplier = 0.95; break;
      }
      
      let interiorMultiplier = 1.0;
      if (details.interiorType) {
        switch (details.interiorType) {
          case "basic": interiorMultiplier = 1.0; break;
          case "premium": interiorMultiplier = 1.2; break;
          case "luxury": interiorMultiplier = 1.4; break;
        }
      }
      
      const materialsFactor = Object.keys(details.materials || {}).length * 0.05 + 1;
      
      const estimatedAmount = Math.round((baseCost * floorMultiplier * typeMultiplier * interiorMultiplier * materialsFactor) / 1000) * 1000;
      
      setEstimatedCost(estimatedAmount);
      setHomeDetailsState((prev) => ({
        ...prev,
        estimatedCost: estimatedAmount,
      }));
    }
  });

  // Set home details
  const setHomeDetails = (details: CustomHomeDetails) => {
    setHomeDetailsState(details);
  };

  // Calculate estimate based on home details
  const calculateEstimate = (details: CustomHomeDetails) => {
    // Make sure we have the minimum required fields
    if (!details.landArea || !details.floors || !details.houseType) {
      return;
    }
    
    calculateCostMutation(details);
  };

  // Reset home details to initial state
  const resetHomeDetails = () => {
    setHomeDetailsState(initialHomeDetails);
    setEstimatedCost(initialHomeDetails.estimatedCost || 2000000);
    sessionStorage.removeItem("homeBuilderDetails");
  };

  return (
    <BuilderContext.Provider
      value={{
        homeDetails,
        estimatedCost,
        setHomeDetails,
        calculateEstimate,
        resetHomeDetails,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
