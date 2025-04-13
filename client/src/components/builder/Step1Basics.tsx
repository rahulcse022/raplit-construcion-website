import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useBuilder } from "@/context/BuilderContext";
import { HouseType, BudgetRange } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

interface Step1BasicsProps {
  onNext: () => void;
  isPreview?: boolean;
}

const Step1Basics = ({ onNext, isPreview = false }: Step1BasicsProps) => {
  const { t } = useLanguage();
  const { homeDetails, setHomeDetails, calculateEstimate } = useBuilder();
  
  const [selectedHouseType, setSelectedHouseType] = useState<HouseType>(homeDetails.houseType || "modern");

  const handleHouseTypeSelect = (type: HouseType) => {
    setSelectedHouseType(type);
    setHomeDetails({ ...homeDetails, houseType: type });
    calculateEstimate({ ...homeDetails, houseType: type });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "landArea") {
      const newValue = parseInt(value) || 0;
      setHomeDetails({ ...homeDetails, landArea: newValue });
      calculateEstimate({ ...homeDetails, landArea: newValue });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "floors") {
      const floors = parseInt(value);
      setHomeDetails({ ...homeDetails, floors });
      calculateEstimate({ ...homeDetails, floors });
    } else if (name === "bedrooms") {
      const bedrooms = parseInt(value);
      setHomeDetails({ ...homeDetails, bedrooms });
      calculateEstimate({ ...homeDetails, bedrooms });
    } else if (name === "bathrooms") {
      const bathrooms = parseInt(value);
      setHomeDetails({ ...homeDetails, bathrooms });
      calculateEstimate({ ...homeDetails, bathrooms });
    } else if (name === "budgetRange") {
      setHomeDetails({ ...homeDetails, budgetRange: value as BudgetRange });
      calculateEstimate({ ...homeDetails, budgetRange: value as BudgetRange });
    }
  };

  // House types with images and labels
  const houseTypes = [
    {
      type: "modern" as HouseType,
      imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      label: t("customBuilder.houseTypes.modern"),
    },
    {
      type: "traditional" as HouseType,
      imageUrl: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      label: t("customBuilder.houseTypes.traditional"),
    },
    {
      type: "contemporary" as HouseType,
      imageUrl: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
      label: t("customBuilder.houseTypes.contemporary"),
    },
  ];

  return (
    <div id="step1">
      <h3 className="font-heading font-semibold text-xl mb-6 text-gray-900">
        {t("customBuilder.basicDetails")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Land Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("customBuilder.landArea")}
          </label>
          <Input
            type="number"
            name="landArea"
            value={homeDetails.landArea || ""}
            onChange={handleInputChange}
            placeholder="e.g. 1200"
            min="500"
            className="w-full"
          />
        </div>

        {/* Number of Floors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("customBuilder.floors")}
          </label>
          <Select 
            value={homeDetails.floors?.toString() || "1"} 
            onValueChange={(value) => handleSelectChange("floors", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("customBuilder.selectFloors")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("customBuilder.bedrooms")}
          </label>
          <Select 
            value={homeDetails.bedrooms?.toString() || "2"} 
            onValueChange={(value) => handleSelectChange("bedrooms", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("customBuilder.selectBedrooms")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("customBuilder.bathrooms")}
          </label>
          <Select 
            value={homeDetails.bathrooms?.toString() || "2"} 
            onValueChange={(value) => handleSelectChange("bathrooms", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("customBuilder.selectBathrooms")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* House Type Selection */}
      <h4 className="font-medium text-lg mb-3 text-gray-900">
        {t("customBuilder.selectHouseType")}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {houseTypes.map((house) => (
          <div
            key={house.type}
            className={`border rounded-lg p-2 cursor-pointer hover:border-primary-500 transition-colors ${
              selectedHouseType === house.type
                ? "border-primary-500"
                : "border-gray-200"
            }`}
            onClick={() => handleHouseTypeSelect(house.type)}
          >
            <img
              src={house.imageUrl}
              alt={house.label}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <div className="text-center">
              <h5 className="font-medium">{house.label}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Budget Range */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("customBuilder.budgetRange")}
        </label>
        <div className="grid grid-cols-3 gap-4">
          <Select 
            value={homeDetails.budgetRange || "20-30"} 
            onValueChange={(value) => handleSelectChange("budgetRange", value)}
            className="col-span-2"
          >
            <SelectTrigger>
              <SelectValue placeholder={t("customBuilder.selectBudget")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15-20">₹15-20 {t("packages.lakhs")}</SelectItem>
              <SelectItem value="20-30">₹20-30 {t("packages.lakhs")}</SelectItem>
              <SelectItem value="30-50">₹30-50 {t("packages.lakhs")}</SelectItem>
              <SelectItem value="50-75">₹50-75 {t("packages.lakhs")}</SelectItem>
              <SelectItem value="75-100">₹75 {t("packages.lakhs")} - 1 {t("packages.crore")}</SelectItem>
              <SelectItem value="100+">₹1+ {t("packages.crore")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600 px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z"
                clipRule="evenodd"
              />
            </svg>
            {t("customBuilder.estimate")}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!homeDetails.landArea}>
          {t("customBuilder.nextDesign")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step1Basics;
