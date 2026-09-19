import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import trTranslation from './locales/tr.json';
import enTranslation from './locales/en.json';
import cityTr from './locales/city.tr.json';
import cityEn from './locales/city.en.json';

const resources = {
  tr: {
    translation: { ...trTranslation, city: cityTr }
  },
  en: {
    translation: { ...enTranslation, city: cityEn }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr',
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
