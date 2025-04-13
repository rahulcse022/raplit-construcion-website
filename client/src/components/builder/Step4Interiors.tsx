import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useBuilder } from "@/context/BuilderContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { InteriorType } from "@shared/schema";

interface Step4InteriorsProps {
  onNext: () => void;
  onBack: () => void;
}

const Step4Interiors = ({ onNext, onBack }: Step4InteriorsProps) => {
  const { t } = useLanguage();
  const { homeDetails, setHomeDetails, calculateEstimate } = useBuilder();

  // Initialize interior options from homeDetails or with defaults
  const [interiorType, setInteriorType] = useState<InteriorType>(
    homeDetails.interiorType || "basic"
  );
  
  const [lightingQuality, setLightingQuality] = useState<number>(
    homeDetails.interiors?.lightingQuality || 1
  );
  
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>(
    homeDetails.interiors?.appliances || []
  );

  // Interior type options
  const interiorTypes = [
    { 
      id: "basic" as InteriorType, 
      label: t("customBuilder.interiors.types.basic.label"),
      description: t("customBuilder.interiors.types.basic.description"),
    },
    { 
      id: "premium" as InteriorType, 
      label: t("customBuilder.interiors.types.premium.label"),
      description: t("customBuilder.interiors.types.premium.description"),
    },
    { 
      id: "luxury" as InteriorType, 
      label: t("customBuilder.interiors.types.luxury.label"),
      description: t("customBuilder.interiors.types.luxury.description"),
    },
  ];

  // Appliance options
  const applianceOptions = [
    { id: "ac", label: t("customBuilder.interiors.appliances.ac") },
    { id: "refrigerator", label: t("customBuilder.interiors.appliances.refrigerator") },
    { id: "washer", label: t("customBuilder.interiors.appliances.washer") },
    { id: "microwave", label: t("customBuilder.interiors.appliances.microwave") },
    { id: "dishwasher", label: t("customBuilder.interiors.appliances.dishwasher") },
    { id: "waterHeater", label: t("customBuilder.interiors.appliances.waterHeater") },
  ];

  // Handle interior type change
  const handleInteriorTypeChange = (value: string) => {
    const newType = value as InteriorType;
    setInteriorType(newType);
    setHomeDetails({
      ...homeDetails,
      interiorType: newType,
    });
    calculateEstimate({
      ...homeDetails,
      interiorType: newType,
    });
  };

  // Handle lighting quality change
  const handleLightingQualityChange = (values: number[]) => {
    const value = values[0];
    setLightingQuality(value);
    const updatedInteriors = {
      ...homeDetails.interiors,
      lightingQuality: value,
    };
    setHomeDetails({
      ...homeDetails,
      interiors: updatedInteriors,
    });
    calculateEstimate({
      ...homeDetails,
      interiors: updatedInteriors,
    });
  };

  // Handle appliance selection
  const handleApplianceChange = (applianceId: string, checked: boolean) => {
    let updatedAppliances;
    
    if (checked) {
      updatedAppliances = [...selectedAppliances, applianceId];
    } else {
      updatedAppliances = selectedAppliances.filter(id => id !== applianceId);
    }
    
    setSelectedAppliances(updatedAppliances);
    
    const updatedInteriors = {
      ...homeDetails.interiors,
      appliances: updatedAppliances,
    };
    
    setHomeDetails({
      ...homeDetails,
      interiors: updatedInteriors,
    });
    
    calculateEstimate({
      ...homeDetails,
      interiors: updatedInteriors,
    });
  };

  // Handle next button click
  const handleNext = () => {
    // Save all interior selections
    setHomeDetails({
      ...homeDetails,
      interiorType,
      interiors: {
        ...homeDetails.interiors,
        lightingQuality,
        appliances: selectedAppliances,
      },
    });
    
    onNext();
  };

  // Interior type preview images
  const interiorTypeImages = {
    basic: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&h=400&q=80",
    premium: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&h=400&q=80",
    luxury: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&h=400&q=80",
  };

  return (
    <div className="space-y-8">
      <h3 className="font-heading font-semibold text-xl text-gray-900">
        {t("customBuilder.interiors.title")}
      </h3>
      
      {/* Interior Type Selection */}
      <div>
        <h4 className="font-medium text-lg mb-4 text-gray-900">
          {t("customBuilder.interiors.selectInteriorType")}
        </h4>
        
        <div className="mb-6">
          <img 
            src={interiorTypeImages[interiorType]} 
            alt={interiorTypes.find(type => type.id === interiorType)?.label} 
            className="w-full h-48 object-cover rounded-lg mb-4" 
          />
        </div>
        
        <RadioGroup
          value={interiorType}
          onValueChange={handleInteriorTypeChange}
          className="space-y-3"
        >
          {interiorTypes.map((type) => (
            <div 
              key={type.id} 
              className={`flex items-start space-x-3 rounded-lg border p-4 ${
                interiorType === type.id ? "border-primary-500 bg-primary-50" : "border-gray-200"
              }`}
            >
              <RadioGroupItem value={type.id} id={`interior-${type.id}`} className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor={`interior-${type.id}`} className="font-medium text-gray-900">
                  {type.label}
                </Label>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Lighting Quality */}
      <div>
        <h4 className="font-medium text-lg mb-4 text-gray-900">
          {t("customBuilder.interiors.lightingQuality")}
        </h4>
        
        <div className="space-y-4">
          <div className="flex justify-between mb-2 text-sm">
            <span>{t("customBuilder.interiors.lightingLevels.basic")}</span>
            <span>{t("customBuilder.interiors.lightingLevels.standard")}</span>
            <span>{t("customBuilder.interiors.lightingLevels.premium")}</span>
          </div>
          
          <Slider
            value={[lightingQuality]}
            onValueChange={handleLightingQualityChange}
            min={1}
            max={3}
            step={1}
            className="w-full"
          />
          
          <p className="text-sm text-gray-600">
            {lightingQuality === 1 && t("customBuilder.interiors.lightingDescriptions.basic")}
            {lightingQuality === 2 && t("customBuilder.interiors.lightingDescriptions.standard")}
            {lightingQuality === 3 && t("customBuilder.interiors.lightingDescriptions.premium")}
          </p>
        </div>
      </div>
      
      {/* Appliances */}
      <div>
        <h4 className="font-medium text-lg mb-4 text-gray-900">
          {t("customBuilder.interiors.selectAppliances")}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {applianceOptions.map((appliance) => (
            <div key={appliance.id} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
              <Checkbox
                id={`appliance-${appliance.id}`}
                checked={selectedAppliances.includes(appliance.id)}
                onCheckedChange={(checked) => handleApplianceChange(appliance.id, checked as boolean)}
              />
              <Label htmlFor={`appliance-${appliance.id}`} className="flex-1 cursor-pointer">
                {appliance.label}
              </Label>
            </div>
          ))}
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          {t("customBuilder.interiors.appliancesNote")}
        </p>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("customBuilder.back")}
        </Button>
        <Button onClick={handleNext}>
          {t("customBuilder.nextSummary")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step4Interiors;
