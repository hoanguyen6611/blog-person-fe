// i18n/client.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "vi",
  fallbackLng: "vi",
  interpolation: { escapeValue: false },
  resources: {
    vi: { translation: {} },
    en: { translation: {} },
  },
});

export default i18n;
