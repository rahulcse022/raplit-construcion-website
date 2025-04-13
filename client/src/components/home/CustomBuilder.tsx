import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import Step1Basics from "@/components/builder/Step1Basics";

const CustomBuilder = () => {
  const { t } = useLanguage();

  return (
    <section
      id="custom-builder"
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-gray-900 mb-6">
            {t("customBuilder.title")}
          </h2>
          <p className="text-gray-800 max-w-3xl mx-auto text-lg">
            {t("customBuilder.subtitle")}
          </p>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-gray-200">
            {/* Stepper */}
            <div className="flex justify-between mb-8 relative">
              <div className="absolute top-1/2 h-2 bg-gray-300 left-0 right-0 -translate-y-1/2"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#0F55DB] text-white flex items-center justify-center font-semibold text-lg shadow-md">
                  1
                </div>
                <span className="text-sm mt-2 font-medium text-gray-800">
                  {t("customBuilder.steps.basics")}
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-semibold text-lg">
                  2
                </div>
                <span className="text-sm mt-2 font-medium text-gray-700">
                  {t("customBuilder.steps.design")}
                </span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-semibold text-lg">
                  3
                </div>
                <span className="text-sm mt-2 font-medium text-gray-700">
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

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-700 mb-4">
                Explore the full builder experience to customize every aspect of
                your dream home
              </p>
              <Link
                href="/custom-builder"
                className="inline-block bg-[#0F55DB] hover:bg-[#0D3FC2] text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Start Full Builder Experience
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomBuilder;
