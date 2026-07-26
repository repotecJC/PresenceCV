import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { vi } from 'vitest';
import en from './i18n/locales/en.json';

const getTranslation = (key: string) => {
  const keys = key.split('.');
  let result: any = en;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key;
    }
  }
  return typeof result === 'string' ? result : key;
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => getTranslation(key),
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));
