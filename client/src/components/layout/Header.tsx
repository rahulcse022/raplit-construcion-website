import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import MobileMenu from "./MobileMenu";
import { useSavedPlans } from "@/context/SavedPlansContext";
import { Home, Menu } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    console.warn("Language context not available, using fallback translations");
  }
  
  const [location] = useLocation();
  
  // Try to use saved plans context, fallback if not available
  let savedPlans: any[] = [];
  try {
    const savedPlansContext = useSavedPlans();
    savedPlans = savedPlansContext.savedPlans;
  } catch (error) {
    console.warn("SavedPlans context not available, using empty array");
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/packages", label: t("nav.packages") },
    { href: "/custom-builder", label: t("nav.customBuilder") },
    { href: "/materials", label: t("nav.materials") },
    { href: "/portfolio", label: t("nav.portfolio") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Home className="text-primary-600 h-7 w-7 mr-2" />
              <span className="font-heading font-bold text-xl text-primary-800">
                BuildMyHome
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium ${
                  location === item.href
                    ? "text-primary-600"
                    : "text-gray-700 hover:text-primary-600"
                } transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Saved Plans / Cart */}
            <Link
              href="/saved-plans"
              className="flex items-center text-gray-700 hover:text-primary-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="hidden sm:inline">{t("nav.savedPlans")}</span>
              {savedPlans.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs bg-primary-600 text-white rounded-full">
                  {savedPlans.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        navItems={navItems}
      />
    </header>
  );
};

export default Header;
