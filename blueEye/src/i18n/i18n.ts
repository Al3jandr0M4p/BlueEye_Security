import i18n from "i18next";
import { initReactI18next } from "../../node_modules/react-i18next";

import EN from "./en.json";
import ES from "./es.json";

i18n.use(initReactI18next).init({
  // the translations
  // we are going to translate all the text that we are gonna use
  resources: {
    en: {
      translation: EN,
    },
    es: {
      translation: ES,
    },
  },
  lng: "es",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
