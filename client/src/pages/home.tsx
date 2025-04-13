import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import CustomBuilder from "@/components/home/CustomBuilder";
import Packages from "@/components/home/Packages";
import MaterialsShowcase from "@/components/home/MaterialsShowcase";
import PortfolioSection from "@/components/home/PortfolioSection";
import CTASection from "@/components/home/CTASection";
import ContactSection from "@/components/home/ContactSection";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/context/LanguageContext";

const Home = () => {
  // Fallback values if context isn't available
  let t = (key: string) => {
    const parts = key.split('.');
    return parts[parts.length - 1] || key;
  };
  let language: "en" | "hi" = "en";
  
  try {
    const languageContext = useLanguage();
    t = languageContext.t;
    language = languageContext.language;
  } catch (error) {
    console.warn("Language context not available in Home component, using fallbacks");
  }

  return (
    <>
      <Helmet>
        <title>{t("seo.home.title")} | BuildMyHome</title>
        <meta name="description" content={t("seo.home.description")} />
        <html lang={language} />
      </Helmet>

      <HeroSection />
      <ServicesSection />
      <CustomBuilder />
      <Packages />
      <MaterialsShowcase />
      <PortfolioSection />
      <CTASection />
      <ContactSection />
    </>
  );
};

export default Home;
