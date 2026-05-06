"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ar"
  | "zh"
  | "ja"
  | "ru"
  | "tr"
  | "nl";

type LanguageContext = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const Context = createContext<LanguageContext | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem("language") as Language;
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <Context.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </Context.Provider>
  );
}

export function useLanguage() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
