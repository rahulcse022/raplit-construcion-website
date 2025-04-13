import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-primary-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white hover:bg-gray-100 text-primary-700 font-medium py-3 px-8 rounded-lg transition-colors text-center"
            >
              {t("cta.contactUs")}
            </Link>
            <Link
              href="/custom-builder"
              className="bg-transparent hover:bg-primary-600 text-white border border-white font-medium py-3 px-8 rounded-lg transition-colors text-center"
            >
              {t("cta.startBuilding")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
