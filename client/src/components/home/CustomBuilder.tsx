import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useBuilder } from "@/context/BuilderContext";
import Step1Basics from "@/components/builder/Step1Basics";

const CustomBuilder = () => {
  const { t } = useLanguage();
  const { estimatedCost } = useBuilder();
  
  // In the home page we only show step 1
  // Full builder experience is on the custom-builder page
  
  return (
    <section id="custom-builder" className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-gray-900 mb-6">
            {t("customBuilder.title")}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            {t("customBuilder.subtitle")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center max-w-6xl mx-auto">
          {/* Left side: 3D house illustration */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="bg-yellow-100 rounded-2xl p-3 md:p-6 border-2 border-yellow-300">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Custom Home Builder" 
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Interactive
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-4">
                <div className="text-primary-700 font-semibold">Estimated Cost</div>
                <div className="text-2xl font-bold">₹{estimatedCost.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Right side: Custom Builder Wizard */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-gray-100">
              {/* Stepper */}
              <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 h-2 bg-gray-200 left-0 right-0 -translate-y-1/2"></div>

                {/* Step 1 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-lg shadow-md">
                    1
                  </div>
                  <span className="text-sm mt-2 font-medium">
                    {t("customBuilder.steps.basics")}
                  </span>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-lg">
                    2
                  </div>
                  <span className="text-sm mt-2 font-medium text-gray-500">
                    {t("customBuilder.steps.design")}
                  </span>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-lg">
                    3
                  </div>
                  <span className="text-sm mt-2 font-medium text-gray-500">
                    {t("customBuilder.steps.materials")}
                  </span>
                </div>
              </div>

              {/* Form Step 1: Basics */}
              <Step1Basics
                onNext={() => {
                  // In home page version, redirect to the full builder page
                  window.location.href = "/custom-builder";
                }}
                isPreview={true}
              />
              
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-600 mb-4">Explore the full builder experience to customize every aspect of your dream home</p>
                <Link
                  href="/custom-builder"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Start Full Builder Experience
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomBuilder;
