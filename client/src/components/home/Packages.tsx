import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { useSavedPlans } from "@/context/SavedPlansContext";
import { Package } from "@shared/schema";
import { ArrowRight, Heart } from "lucide-react";

const Packages = () => {
  const { t } = useLanguage();
  const { savedPlans, savePlan } = useSavedPlans();

  // We only show 3 packages in the home page
  const packagesData = [
    {
      id: 1,
      name: "Package 1",
      imageUrl: "/images/package1.jpg",
      size: 1000,
      bedrooms: 2,
      bathrooms: 2,
      description: "A great package for starting your journey.",
      price: 2000000,
      popular: true,
      premium: false,
      budget: false,
    },
    {
      id: 2,
      name: "Package 2",
      imageUrl: "/images/package2.jpg",
      size: 1500,
      bedrooms: 3,
      bathrooms: 2,
      description: "A wonderful mid-range option.",
      price: 3500000,
      popular: false,
      premium: false,
      budget: false,
    },
    {
      id: 3,
      name: "Package 3",
      imageUrl: "/images/package3.jpg",
      size: 2000,
      bedrooms: 4,
      bathrooms: 3,
      description: "Perfect for luxury living.",
      price: 6000000,
      popular: false,
      premium: true,
      budget: false,
    },
  ];


  const getPackages = () => {
    return packagesData;
  };

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: () => getPackages()
  });

  const displayPackages = packages?.slice(0, 3) || [];

  const handleSave = (packageData: Package) => {
    savePlan({
      packageId: packageData.id,
      customPackage: null
    });
  };

  const isPackageSaved = (id: number) => {
    return savedPlans.some(plan => plan.packageId === id);
  };

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-gray-900 mb-6">
            {t("packages.title")}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            {t("packages.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-0 right-0 p-4">
                    <button
                      onClick={() => handleSave(pkg)}
                      className={`${
                        isPackageSaved(pkg.id)
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300`}
                      aria-label={isPackageSaved(pkg.id) ? "Remove from saved" : "Save package"}
                    >
                      <Heart 
                        className={`h-5 w-5 transition-all duration-300 ${
                          isPackageSaved(pkg.id) 
                            ? "fill-white text-white" 
                            : "hover:text-red-500"
                        }`} 
                      />
                    </button>
                  </div>
                  {pkg.popular && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
                      {t("packages.popular")}
                    </div>
                  )}
                  {pkg.premium && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
                      {t("packages.premium")}
                    </div>
                  )}
                  {pkg.budget && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
                      {t("packages.budget")}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-heading font-bold text-2xl mb-3 text-gray-900">
                    {pkg.name}
                  </h3>

                  <div className="mb-4 flex flex-wrap items-center text-sm text-gray-600 font-medium">
                    <span className="inline-flex items-center mr-4 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-primary-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold mr-1 text-gray-700">{t("packages.size")}:</span> {pkg.size} sq.ft
                    </span>
                    <span className="inline-flex items-center mr-4 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-primary-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold mr-1 text-gray-700">{t("packages.bedrooms")}:</span> {pkg.bedrooms}
                    </span>
                    <span className="inline-flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-primary-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011-1h8a1 1 0 011 1v1H5V2zm9 6a1 1 0 00-1-1H7a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V8zm-5 2a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold mr-1 text-gray-700">{t("packages.bathrooms")}:</span> {pkg.bathrooms}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-6">{pkg.description}</p>

                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">
                        {t("packages.startingAt")}
                      </div>
                      <div className="text-3xl font-bold text-primary-700">
                        ₹{(pkg.price / 100000).toFixed(2)} {t("packages.lakhs")}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="bg-white text-primary-600 hover:bg-primary-50 border-2 border-primary-600 font-medium py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center"
                    >
                      {t("packages.viewDetails")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    <Link
                      href={`/custom-builder?packageId=${pkg.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center shadow-md hover:shadow-lg block w-full"
                    >
                      {t("packages.customize")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-10">
          <Link
            href="/packages"
            className="bg-white hover:bg-gray-50 text-primary-600 border border-primary-600 font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center"
          >
            {t("packages.viewAllPackages")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Packages;