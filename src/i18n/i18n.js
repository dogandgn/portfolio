import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import trTranslation from './locales/tr.json';
import enTranslation from './locales/en.json';
import cityTr from './locales/city.tr.json';
import cityEn from './locales/city.en.json';
import qgisTr from './locales/qgis.tr.json';
import qgisEn from './locales/qgis.en.json';

const resources = {
  tr: {
    translation: { ...trTranslation, city: cityTr, qgis: qgisTr }
  },
  en: {
    translation: { ...enTranslation, city: cityEn, qgis: qgisEn }
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
