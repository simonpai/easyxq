import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'zh',
    fallbackLng: 'zh',
    ns: ['common', 'bot'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // not needed for React
    },
    backend: {
      loadPath: `${PATH_PREFIX}locales/{{lng}}/{{ns}}.json`,
    }
  });

export default i18n;
