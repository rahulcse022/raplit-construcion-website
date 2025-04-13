import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useBuilder } from "@/context/BuilderContext";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import Step1Basics from "@/components/builder/Step1Basics";
import Step2Design from "@/components/builder/Step2Design";
import Step3Materials from "@/components/builder/Step3Materials";
import Step4Interiors from "@/components/builder/Step4Interiors";
import Step5Summary from "@/components/builder/Step5Summary";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";

const CustomBuilder = () => {
  const { t, language } = useLanguage();
  const { resetHomeDetails } = useBuilder();
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useLocation();
  
  // Extract packageId from URL if present
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const packageId = searchParams.get("packageId");
  
  // Get package details if packageId is present
  const { data: packageData, isLoading: isLoadingPackage } = useQuery<Package>({
    queryKey: packageId ? [`/api/packages/${packageId}`] : null,
    enabled: !!packageId,
  });
  
  // Initialize based on package if present
  useEffect(() => {
    if (packageId && packageData) {
      // Reset and then set home details based on package
      resetHomeDetails();
      // Initialize builder with package details
      // This would typically be handled in the BuilderContext
    }
  }, [packageData, packageId, resetHomeDetails]);
  
  // Function to render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Basics onNext={() => setCurrentStep(2)} />;
      case 2:
        return <Step2Design onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <Step3Materials onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
      case 4:
        return <Step4Interiors onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />;
      case 5:
        return <Step5Summary onBack={() => setCurrentStep(4)} />;
      default:
        return <Step1Basics onNext={() => setCurrentStep(2)} />;
    }
  };
  
  // Steps array for progress indicator
  const steps = [
    { label: t("customBuilder.steps.basics"), step: 1 },
    { label: t("customBuilder.steps.design"), step: 2 },
    { label: t("customBuilder.steps.materials"), step: 3 },
    { label: t("customBuilder.steps.interiors"), step: 4 },
    { label: t("customBuilder.steps.summary"), step: 5 },
  ];

  return (
    <>
      <Helmet>
        <title>{t("seo.customBuilder.title")} | BuildMyHome</title>
        <meta name="description" content={t("seo.customBuilder.description")} />
        <html lang={language} />
      </Helmet>

      <div className="bg-gray-50 py-12 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900">
              {t("customBuilder.pageTitle")}
            </h1>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation("/")}
                className="hidden sm:flex"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                {t("customBuilder.backToHome")}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setLocation("/")}
                className="sm:hidden"
              >
                <HomeIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Package Starting Point Info */}
          {packageId && packageData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center">
              <div className="flex-1">
                <h2 className="font-medium text-blue-800">{t("customBuilder.startingFromPackage")}</h2>
                <p className="text-blue-600">{packageData.name}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  resetHomeDetails();
                  setLocation("/custom-builder");
                }}
                className="text-blue-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                {t("customBuilder.startFresh")}
              </Button>
            </div>
          )}
          
          {/* Stepper */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 h-1 bg-gray-200 left-0 right-0 -translate-y-1/2"></div>
            
            {steps.map((step) => (
              <div key={step.step} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === step.step
                      ? "bg-primary-600 text-white"
                      : currentStep > step.step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.step ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.step
                  )}
                </div>
                <span className={`text-sm mt-2 font-medium ${
                  currentStep === step.step ? "text-gray-900" : "text-gray-500"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          
          {/* Builder Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {isLoadingPackage ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              renderStep()
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomBuilder;
