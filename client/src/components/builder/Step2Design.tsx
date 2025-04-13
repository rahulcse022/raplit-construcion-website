import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useBuilder } from "@/context/BuilderContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Step2DesignProps {
  onNext: () => void;
  onBack: () => void;
}

const Step2Design = ({ onNext, onBack }: Step2DesignProps) => {
  const { t } = useLanguage();
  const { homeDetails, setHomeDetails, calculateEstimate } = useBuilder();

  // Floor plan options with images
  const floorPlans = [
    {
      id: "open",
      imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      title: t("customBuilder.design.floorPlans.open.title"),
      description: t("customBuilder.design.floorPlans.open.description"),
    },
    {
      id: "traditional",
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      title: t("customBuilder.design.floorPlans.traditional.title"),
      description: t("customBuilder.design.floorPlans.traditional.description"),
    },
    {
      id: "hybrid",
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      title: t("customBuilder.design.floorPlans.hybrid.title"),
      description: t("customBuilder.design.floorPlans.hybrid.description"),
    },
  ];

  // Ceiling height options
  const ceilingHeights = [
    { id: "standard", label: t("customBuilder.design.ceilingHeights.standard"), value: "standard", heightCm: 270 },
    { id: "high", label: t("customBuilder.design.ceilingHeights.high"), value: "high", heightCm: 300 },
    { id: "vaulted", label: t("customBuilder.design.ceilingHeights.vaulted"), value: "vaulted", heightCm: 350 },
  ];

  // Window style options
  const windowStyles = [
    {
      id: "standard",
      imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      title: t("customBuilder.design.windowStyles.standard.title"),
      description: t("customBuilder.design.windowStyles.standard.description"),
    },
    {
      id: "large",
      imageUrl: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      title: t("customBuilder.design.windowStyles.large.title"),
      description: t("customBuilder.design.windowStyles.large.description"),
    },
    {
      id: "panoramic",
      imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      title: t("customBuilder.design.windowStyles.panoramic.title"),
      description: t("customBuilder.design.windowStyles.panoramic.description"),
    },
  ];

  // Selected values
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(homeDetails.design?.floorPlan || "open");
  const [selectedCeilingHeight, setSelectedCeilingHeight] = useState(homeDetails.design?.ceilingHeight || "standard");
  const [selectedWindowStyle, setSelectedWindowStyle] = useState(homeDetails.design?.windowStyle || "standard");

  // Handle floor plan selection
  const handleFloorPlanSelect = (id: string) => {
    setSelectedFloorPlan(id);
    const updatedDesign = { 
      ...homeDetails.design,
      floorPlan: id 
    };
    setHomeDetails({ 
      ...homeDetails, 
      design: updatedDesign 
    });
    calculateEstimate({ 
      ...homeDetails, 
      design: updatedDesign 
    });
  };

  // Handle ceiling height selection
  const handleCeilingHeightChange = (value: string) => {
    setSelectedCeilingHeight(value);
    const updatedDesign = { 
      ...homeDetails.design,
      ceilingHeight: value 
    };
    setHomeDetails({ 
      ...homeDetails, 
      design: updatedDesign 
    });
    calculateEstimate({ 
      ...homeDetails, 
      design: updatedDesign 
    });
  };

  // Handle window style selection
  const handleWindowStyleSelect = (id: string) => {
    setSelectedWindowStyle(id);
    const updatedDesign = { 
      ...homeDetails.design,
      windowStyle: id 
    };
    setHomeDetails({ 
      ...homeDetails, 
      design: updatedDesign 
    });
    calculateEstimate({ 
      ...homeDetails, 
      design: updatedDesign
    });
  };

  // Handle next step
  const handleNext = () => {
    // Ensure all design options are selected before proceeding
    if (!selectedFloorPlan || !selectedCeilingHeight || !selectedWindowStyle) {
      return;
    }

    // Save design selections if not already saved
    if (!homeDetails.design || 
        homeDetails.design.floorPlan !== selectedFloorPlan || 
        homeDetails.design.ceilingHeight !== selectedCeilingHeight || 
        homeDetails.design.windowStyle !== selectedWindowStyle) {
      setHomeDetails({
        ...homeDetails,
        design: {
          floorPlan: selectedFloorPlan,
          ceilingHeight: selectedCeilingHeight,
          windowStyle: selectedWindowStyle,
        },
      });
    }

    onNext();
  };

  return (
    <div className="space-y-8">
      <h3 className="font-heading font-semibold text-xl text-gray-900">
        {t("customBuilder.design.title")}
      </h3>
      
      {/* Floor Plan Selection */}
      <div>
        <h4 className="font-medium text-lg mb-4 text-gray-900">
          {t("customBuilder.design.selectFloorPlan")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {floorPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-3 cursor-pointer hover:border-primary-500 transition-colors ${
                selectedFloorPlan === plan.id
                  ? "border-primary-500 ring-2 ring-primary-100"
                  : "border-gray-200"
              }`}
              onClick={() => handleFloorPlanSelect(plan.id)}
            >
              <img
                src={plan.imageUrl}
                alt={plan.title}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h5 className="font-medium text-gray-900 mb-2">{plan.title}</h5>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ceiling Height Selection */}
      <div>
        <h4 className="font-medium text-lg mb-4 text-gray-900">
          {t("customBuilder.design.selectCeilingHeight")}
        </h4>
        <RadioGroup
          value={selectedCeilingHeight}
          onValueChange={handleCeilingHeightChange}
          className="flex flex-col space-y-2"
        >
          {ceilingHeights.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
              <RadioGroupItem value={option.value} id={`ceiling-${option.id}`} />
              <Label htmlFor={`ceiling-${option.id}`} className="flex-1 cursor-pointer">
                <span className="font-medium">{option.label}</span>
                <span className="text-sm text-gray-500 ml-2">({option.heightCm} cm)</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Window Style Selection */}
      <div>
        <h4 className="font-medium text-lg mb-4 text-gray-900">
          {t("customBuilder.design.selectWindowStyle")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {windowStyles.map((style) => (
            <div
              key={style.id}
              className={`border rounded-lg p-3 cursor-pointer hover:border-primary-500 transition-colors ${
                selectedWindowStyle === style.id
                  ? "border-primary-500 ring-2 ring-primary-100"
                  : "border-gray-200"
              }`}
              onClick={() => handleWindowStyleSelect(style.id)}
            >
              <img
                src={style.imageUrl}
                alt={style.title}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h5 className="font-medium text-gray-900 mb-2">{style.title}</h5>
              <p className="text-sm text-gray-600">{style.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("customBuilder.back")}
        </Button>
        <Button onClick={handleNext}>
          {t("customBuilder.nextMaterials")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step2Design;
