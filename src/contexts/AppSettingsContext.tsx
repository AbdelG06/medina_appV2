import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import i18n from "@/i18n";

export type Language = "fr" | "ar";
export type Theme = "light" | "dark";

type AppSettingsContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  isRtl: boolean;
  t: (fr: string, ar: string) => string;
};

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

const LANGUAGE_KEY = "fes-language";
const THEME_KEY = "fes-theme";

const getInitialLanguage = (): Language => {
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  if (saved === "ar" || saved === "fr") {
    return saved;
  }
  return i18n.resolvedLanguage === "ar" ? "ar" : "fr";
};

const getInitialTheme = (): Theme => {
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    void i18n.changeLanguage(nextLanguage);
  };

  useEffect(() => {
    void i18n.changeLanguage(language);
    window.localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", language === "ar");
  }, [language]);

  useEffect(() => {
    // Apply persisted theme by toggling Tailwind's .dark class.
    window.localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      language,
      setLanguage,
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      isRtl: language === "ar",
      t: (fr: string, ar: string) => (language === "ar" ? ar : fr),
    }),
    [language, theme],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
};

export const useAppSettings = () => {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings doit etre utilise dans AppSettingsProvider.");
  }
  return ctx;
};
