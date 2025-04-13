import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default language state if context is not available
  const [fallbackLanguage, setFallbackLanguage] = useState<"en" | "hi">("en");
  const fallbackT = (key: string) => key.split(".").pop() || "";
  
  // Safely try to use language context
  let language: "en" | "hi" = fallbackLanguage;
  let setLanguage: (lang: "en" | "hi") => void = setFallbackLanguage;
  let t: (key: string) => string = fallbackT;
  
  try {
    const languageContext = useLanguage();
    language = languageContext.language;
    setLanguage = languageContext.setLanguage;
    t = languageContext.t;
  } catch (error) {
    console.warn("Language context not available in LanguageToggle, using fallback");
  }
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: "en" | "hi") => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="h-4 w-4 mr-1" />
        <span>{language === "en" ? "English" : "हिंदी"}</span>
        <svg
          className={`h-4 w-4 ml-1 transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`absolute right-0 mt-2 bg-white shadow-lg rounded-md py-1 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <button
          className={`block w-full text-left px-4 py-2 text-sm ${
            language === "en" ? "text-primary-600 bg-gray-50" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleLanguageChange("en")}
        >
          English
        </button>
        <button
          className={`block w-full text-left px-4 py-2 text-sm font-hindi ${
            language === "hi" ? "text-primary-600 bg-gray-50" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleLanguageChange("hi")}
        >
          हिंदी
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
