import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "@/lib/translations";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    return storedLanguage === "hi" ? "hi" : "en";
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
    
    // Update document language for accessibility
    document.documentElement.lang = language;
    
    // Add language-specific font class to body
    if (language === "hi") {
      document.body.classList.add("font-hindi");
    } else {
      document.body.classList.remove("font-hindi");
    }
  }, [language]);

  // Function to get translated text
  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key itself if translation is missing
      }
      current = current[k];
    }
    
    return current;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
