import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useBuilder } from "@/context/BuilderContext";
import { useQuery } from "@tanstack/react-query";
import { Material } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Step3MaterialsProps {
  onNext: () => void;
  onBack: () => void;
}

const Step3Materials = ({ onNext, onBack }: Step3MaterialsProps) => {
  const { t } = useLanguage();
  const { homeDetails, setHomeDetails, calculateEstimate } = useBuilder();
  const [activeCategory, setActiveCategory] = useState("flooring");
  
  // Initialize selected materials from homeDetails or with empty object
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>(
    homeDetails.materials || {}
  );

  // Get all materials from API
  const { data: allMaterials, isLoading } = useQuery<Material[]>({
    queryKey: ['/api/materials'],
  });

  // Material categories
  const categories = [
    { id: "flooring", label: t("materials.categories.flooring") },
    { id: "walls", label: t("materials.categories.walls") },
    { id: "kitchen", label: t("materials.categories.kitchen") },
    { id: "bathroom", label: t("materials.categories.bathroom") },
    { id: "doors", label: t("materials.categories.doors") },
  ];

  // Filter materials by active category
  const filteredMaterials = allMaterials
    ? allMaterials.filter((material) => material.category === activeCategory)
    : [];

  // Handle material selection
  const handleMaterialSelect = (materialId: number) => {
    const updatedMaterials = {
      ...selectedMaterials,
      [activeCategory]: materialId,
    };
    
    setSelectedMaterials(updatedMaterials);
    
    // Update builder context
    setHomeDetails({
      ...homeDetails,
      materials: updatedMaterials,
    });
    
    // Recalculate estimate
    calculateEstimate({
      ...homeDetails,
      materials: updatedMaterials,
    });
  };

  // Check if a material is selected
  const isMaterialSelected = (materialId: number) => {
    return selectedMaterials[activeCategory] === materialId;
  };

  // Check if all required materials are selected
  const isSelectionComplete = () => {
    return categories.every(category => selectedMaterials[category.id]);
  };

  // Handle next step
  const handleNext = () => {
    if (isSelectionComplete()) {
      onNext();
    }
  };

  // Loading placeholders
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={index} className="border rounded-lg p-3">
        <Skeleton className="w-full h-32 rounded-md mb-3" />
        <Skeleton className="w-3/4 h-5 mb-2" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-1/2 h-4 mt-1" />
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <h3 className="font-heading font-semibold text-xl text-gray-900">
        {t("customBuilder.materials.title")}
      </h3>
      
      <p className="text-gray-600">
        {t("customBuilder.materials.description")}
      </p>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-6">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="relative"
            >
              {selectedMaterials[category.id] && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                renderSkeletons()
              ) : (
                filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className={`border rounded-lg p-3 cursor-pointer hover:border-primary-500 transition-colors ${
                      isMaterialSelected(material.id)
                        ? "border-primary-500 ring-2 ring-primary-100"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleMaterialSelect(material.id)}
                  >
                    <div className="relative">
                      <img
                        src={material.imageUrl}
                        alt={material.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      {material.premium && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {t("materials.premium")}
                        </div>
                      )}
                      {isMaterialSelected(material.id) && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <h5 className="font-medium text-gray-900 mb-2">{material.name}</h5>
                    <p className="text-sm text-gray-600">{material.description}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Selection status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">
          {t("customBuilder.materials.selectedMaterials")}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {categories.map((category) => {
            const selectedId = selectedMaterials[category.id];
            const selectedMaterial = allMaterials?.find(m => m.id === selectedId);
            
            return (
              <div 
                key={category.id} 
                className={`p-2 rounded-md text-center text-sm ${
                  selectedMaterial 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <div className="font-medium">{category.label}</div>
                <div className="truncate">
                  {selectedMaterial ? selectedMaterial.name : t("customBuilder.materials.notSelected")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("customBuilder.back")}
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!isSelectionComplete()}
        >
          {t("customBuilder.nextInteriors")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step3Materials;
