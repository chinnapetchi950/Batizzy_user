import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// Import translations
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

const resources = {
  en: {translation: en},
  fr: {translation: fr},
  de: {translation: de},
};

// Initialize i18n
i18n
  .use(initReactI18next) // Pass the instance to react-i18next
  .init({
    resources, // Attach the translations
    fallbackLng: 'en', // Default language if detection fails
    lng: 'en', // Set default language (will be updated by LanguageContext)
    supportedLngs: ['en', 'fr', 'de'], // List of supported languages
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
