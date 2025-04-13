import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Material } from "@shared/schema";

const Materials = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: materials, isLoading } = useQuery<Material[]>({
    queryKey: [`/api/materials?category=${activeCategory}`]
  });

  const categories = [
    { id: "all", label: t("materials.categories.all") },
    { id: "flooring", label: t("materials.categories.flooring") },
    { id: "walls", label: t("materials.categories.walls") },
    { id: "kitchen", label: t("materials.categories.kitchen") },
    { id: "bathroom", label: t("materials.categories.bathroom") },
    { id: "doors", label: t("materials.categories.doors") },
  ];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <>
      <Helmet>
        <title>{t("seo.materials.title")} | BuildMyHome</title>
        <meta name="description" content={t("seo.materials.description")} />
        <html lang={language} />
      </Helmet>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-4">
              {t("materials.pageTitle")}
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t("materials.pageDescription")}
            </p>
          </div>

          {/* Material Categories Tabs */}
          <div className="mb-8">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`${
                    activeCategory === category.id
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Materials Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          ) : materials && materials.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {material.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {t(`materials.categories.${material.category}`)}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {material.premium ? t("materials.premium") : t("materials.standard")}
                      </span>
                      <Link
                        href={`/materials/${material.id}`}
                        className="text-primary-600 text-sm font-medium hover:underline"
                      >
                        {t("materials.details")}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                {t("materials.noMaterialsFound")}
              </p>
            </div>
          )}
          
          {/* Educational Section */}
          <div className="mt-16 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-4 text-center">
              {t("materials.choosingMaterials.title")}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="font-semibold text-xl mb-3">
                  {t("materials.choosingMaterials.factors.title")}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("materials.choosingMaterials.factors.durability")}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("materials.choosingMaterials.factors.aesthetics")}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("materials.choosingMaterials.factors.maintenance")}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("materials.choosingMaterials.factors.costEffectiveness")}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("materials.choosingMaterials.factors.sustainability")}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-xl mb-3">
                  {t("materials.choosingMaterials.expertAdvice.title")}
                </h3>
                <p className="text-gray-700 mb-3">
                  {t("materials.choosingMaterials.expertAdvice.description")}
                </p>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h4 className="font-medium text-primary-800 mb-2">
                    {t("materials.choosingMaterials.expertAdvice.consultationTitle")}
                  </h4>
                  <p className="text-primary-700 text-sm">
                    {t("materials.choosingMaterials.expertAdvice.consultationDescription")}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block mt-3 text-primary-600 font-medium hover:underline"
                  >
                    {t("materials.choosingMaterials.expertAdvice.scheduleConsultation")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Materials;
