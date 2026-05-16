"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContext = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const Context = createContext<ThemeContext | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeState(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  const toggle = () => setTheme(theme === "light" ? "dark" : "light");

  if (!mounted) return <>{children}</>;

  return (
    <Context.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </Context.Provider>
  );
}

export function useTheme() {
  const context = useContext(Context);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
