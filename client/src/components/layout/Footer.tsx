import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { Home, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  // Create a fallback translation function
  const fallbackT = (key: string) => {
    const lastPart = key.split('.').pop() || '';
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };
  
  // Try to use the language context, fallback if not available
  let t: (key: string) => string;
  try {
    const languageContext = useLanguage();
    t = languageContext.t;
  } catch (error) {
    t = fallbackT;
    console.warn("Language context not available in Footer, using fallback translations");
  }

  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, href: "#" },
    { icon: <Instagram className="h-4 w-4" />, href: "#" },
    { icon: <Twitter className="h-4 w-4" />, href: "#" },
    { icon: <Youtube className="h-4 w-4" />, href: "#" },
  ];

  const quickLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.aboutUs"), href: "#" },
    { label: t("nav.services"), href: "#" },
    { label: t("nav.packages"), href: "/packages" },
    { label: t("nav.portfolio"), href: "/portfolio" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const services = [
    { label: t("footer.services.customHome"), href: "/custom-builder" },
    { label: t("footer.services.interiorDesign"), href: "#" },
    { label: t("footer.services.homeRenovation"), href: "#" },
    { label: t("footer.services.architecturalPlanning"), href: "#" },
    { label: t("footer.services.materialSupply"), href: "/materials" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Home className="text-primary-400 h-7 w-7 mr-2" />
              <span className="font-heading font-bold text-xl">BuildMyHome</span>
            </div>
            <p className="text-gray-400 mb-6">
              {t("footer.companyDescription")}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Social media link"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.ourServices")}</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.contactUs")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-1 mr-3 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-gray-400">
                  {t("footer.address")}
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-1 mr-3 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-1 mr-3 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="text-gray-400">info@buildmyhome.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} BuildMyHome. {t("footer.allRightsReserved")}
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t("footer.privacyPolicy")}
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t("footer.termsOfService")}
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t("footer.sitemap")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
