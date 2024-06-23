import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './assets/locales/en/translation.json';
import translationFR from './assets/locales/fr/translation.json';

// Les traductions sont définies ici
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  }
};

i18n
  .use(initReactI18next) // Passez i18n instance à react-i18next
  .init({
    resources,
    lng: 'en', // Langue par défaut
    fallbackLng: 'en', // Langue de repli
    interpolation: {
      escapeValue: false // React se charge déjà de l'échappement
    }
  });

export default i18n;
