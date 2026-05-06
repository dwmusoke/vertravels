'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', direction: 'ltr' },
];

type LanguageContext = {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  languages: Language[];
};

const Context = React.createContext<LanguageContext | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>(languages[0]);
  const pathname = usePathname();
  const router = useRouter();

  const setLanguage = (code: string) => {
    const lang = languages.find(l => l.code === code);
    if (lang) {
      setCurrentLanguage(lang);
      document.documentElement.lang = code;
      document.documentElement.dir = lang.direction;
      
      // Store in localStorage
      localStorage.setItem('vertravels_language', code);
      
      // Update URL with language prefix
      const newPath = code === 'en' 
        ? pathname.replace(/^\/[a-z]{2}/, '') 
        : `/${code}${pathname.replace(/^\/[a-z]{2}/, '')}`;
      
      router.push(newPath);
    }
  };

  React.useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('vertravels_language');
    if (saved) {
      const lang = languages.find(l => l.code === saved);
      if (lang) {
        setCurrentLanguage(lang);
        document.documentElement.lang = saved;
        document.documentElement.dir = lang.direction;
      }
    }
  }, []);

  const value = {
    currentLanguage,
    setLanguage,
    languages,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLanguage() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
