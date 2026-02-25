import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "@/locales/fr.json";
import ar from "@/locales/ar.json";

const LANGUAGE_KEY = "fes-language";

const detectInitialLanguage = () => {
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  return saved === "ar" ? "ar" : "fr";
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: detectInitialLanguage(),
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
