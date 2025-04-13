import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Material } from "@shared/schema";
import { ChevronRight } from "lucide-react";

const MaterialsShowcase = () => {
  const { t } = useLanguage();
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

  // Limit to 8 materials for the homepage
  const displayMaterials = materials?.slice(0, 8) || [];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-gray-900 mb-6">
            {t("materials.title")}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            {t("materials.subtitle")}
          </p>
        </div>

        {/* Material Categories Tabs */}
        <div className="mb-12">
          <div className="flex overflow-x-auto justify-center space-x-4 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${
                  activeCategory === category.id
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                } px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Materials Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayMaterials.length > 0 ? displayMaterials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {material.imageUrl ? (
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {material.name}
                  </h3>
                  <div className="flex items-center mb-3">
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full font-medium">
                      {t(`materials.categories.${material.category}`)}
                    </span>
                    <span className={`ml-2 inline-block ${material.premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} text-xs px-3 py-1 rounded-full font-medium`}>
                      {material.premium ? t("materials.premium") : t("materials.standard")}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <Link
                      href={`/materials/${material.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                    >
                      {t("materials.details")}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-4 py-16 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No materials found</h3>
                <p className="mt-1 text-sm text-gray-500">Try selecting a different category or check back later.</p>
              </div>
            )}
          </div>
        )}

        {/* View All Materials Button */}
        <div className="text-center mt-10">
          <Link
            href="/materials"
            className="bg-white hover:bg-gray-50 text-primary-600 border border-primary-600 font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center"
          >
            {t("materials.exploreAllMaterials")}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MaterialsShowcase;
