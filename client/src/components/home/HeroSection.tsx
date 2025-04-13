import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=600&q=80"
          alt="Modern Home Construction"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-heading font-bold text-3xl md:text-5xl mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-lg mb-8 text-gray-100">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/custom-builder"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              {t("hero.startBuilding")}
            </Link>
            <Link
              href="/packages"
              className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-center border border-gray-300"
            >
              {t("hero.viewPackages")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
