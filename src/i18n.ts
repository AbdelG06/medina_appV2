import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

const LANGUAGE_KEY = "fes-language";

const detectInitialLanguage = () => {
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  return saved === "en" ? "en" : "fr";
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: detectInitialLanguage(),
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
