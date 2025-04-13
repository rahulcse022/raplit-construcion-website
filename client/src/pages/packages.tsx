import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSavedPlans } from "@/context/SavedPlansContext";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowRight, Heart } from "lucide-react";

const Packages = () => {
  const { t, language } = useLanguage();
  const { savedPlans, savePlan } = useSavedPlans();
  
  // Filter states
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [bhkFilter, setBhkFilter] = useState<string>("all");
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  
  // Get packages with filters
  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: [
      '/api/packages', 
      { size: sizeFilter, bhk: bhkFilter, style: styleFilter, budget: budgetFilter }
    ],
  });
  
  // Save package to saved plans
  const handleSave = (packageData: Package) => {
    savePlan({
      packageId: packageData.id,
      customPackage: null
    });
  };
  
  // Check if a package is saved
  const isPackageSaved = (id: number) => {
    return savedPlans.some(plan => plan.packageId === id);
  };

  return (
    <>
      <Helmet>
        <title>{t("seo.packages.title")} | BuildMyHome</title>
        <meta name="description" content={t("seo.packages.description")} />
        <html lang={language} />
      </Helmet>

      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-4">
              {t("packages.pageTitle")}
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t("packages.pageDescription")}
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 shadow-sm">
            <div className="flex flex-wrap gap-4">
              {/* Filter by Size */}
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("packages.filters.size")}
                </label>
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder={t("packages.filters.allSizes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("packages.filters.allSizes")}</SelectItem>
                    <SelectItem value="small">{t("packages.filters.small")}</SelectItem>
                    <SelectItem value="medium">{t("packages.filters.medium")}</SelectItem>
                    <SelectItem value="large">{t("packages.filters.large")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filter by BHK */}
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("packages.filters.bhk")}
                </label>
                <Select value={bhkFilter} onValueChange={setBhkFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder={t("packages.filters.allBHK")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("packages.filters.allBHK")}</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4+">4+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filter by Style */}
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("packages.filters.style")}
                </label>
                <Select value={styleFilter} onValueChange={setStyleFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder={t("packages.filters.allStyles")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("packages.filters.allStyles")}</SelectItem>
                    <SelectItem value="modern">{t("packages.filters.modern")}</SelectItem>
                    <SelectItem value="traditional">{t("packages.filters.traditional")}</SelectItem>
                    <SelectItem value="contemporary">{t("packages.filters.contemporary")}</SelectItem>
                    <SelectItem value="minimalist">{t("packages.filters.minimalist")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filter by Budget */}
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("packages.filters.budget")}
                </label>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder={t("packages.filters.allBudgets")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("packages.filters.allBudgets")}</SelectItem>
                    <SelectItem value="15-20">₹15-20 {t("packages.lakhs")}</SelectItem>
                    <SelectItem value="20-30">₹20-30 {t("packages.lakhs")}</SelectItem>
                    <SelectItem value="30-50">₹30-50 {t("packages.lakhs")}</SelectItem>
                    <SelectItem value="50+">₹50+ {t("packages.lakhs")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Packages Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-[500px]"></div>
              ))}
            </div>
          ) : packages && packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="w-full h-48 object-cover"
                    />
                    {pkg.popular && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        {t("packages.popular")}
                      </div>
                    )}
                    {pkg.premium && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        {t("packages.premium")}
                      </div>
                    )}
                    {pkg.budget && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        {t("packages.budget")}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-xl mb-2 text-gray-900">
                      {pkg.name}
                    </h3>

                    <div className="mb-4 flex items-center text-sm text-gray-500">
                      <span className="inline-flex items-center mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {pkg.size} sq.ft
                      </span>
                      <span className="inline-flex items-center mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
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
                        {pkg.bedrooms} BHK
                      </span>
                      <span className="inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 2a1 1 0 011-1h8a1 1 0 011 1v1H5V2zm9 6a1 1 0 00-1-1H7a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V8zm-5 2a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {pkg.bathrooms}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{pkg.description}</p>

                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          {t("packages.startingAt")}
                        </div>
                        <div className="text-2xl font-semibold text-primary-700">
                          ₹{(pkg.price / 100000).toFixed(2)} {t("packages.lakhs")}
                        </div>
                      </div>
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                      >
                        {t("packages.viewDetails")}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Link
                        href={`/custom-builder?packageId=${pkg.id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                      >
                        {t("packages.customize")}
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => handleSave(pkg)}
                        className={`${
                          isPackageSaved(pkg.id)
                            ? "bg-primary-50 text-primary-600"
                            : "bg-white text-primary-600"
                        } border border-primary-600 font-medium flex items-center justify-center`}
                      >
                        {isPackageSaved(pkg.id) ? t("packages.saved") : t("packages.save")}
                        <Heart className={`h-4 w-4 ml-1 ${isPackageSaved(pkg.id) ? "fill-primary-600" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                {t("packages.noPackagesFound")}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSizeFilter("all");
                  setBhkFilter("all");
                  setStyleFilter("all");
                  setBudgetFilter("all");
                }}
                className="mt-4"
              >
                {t("packages.clearFilters")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Packages;
