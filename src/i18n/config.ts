import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import zhTWTranslation from './locales/zh-TW.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  'zh-TW': {
    translation: zhTWTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh-TW'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Setup default to English if not zh-TW
i18n.on('languageChanged', (lng) => {
  if (lng !== 'zh-TW' && lng !== 'en') {
    if (lng.startsWith('zh')) {
      i18n.changeLanguage('zh-TW');
    } else {
      i18n.changeLanguage('en');
    }
  }
});

export default i18n;
