import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import de from './locales/de';

// Get saved language or detect browser language
const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem('peptide_app_language');
    if (saved) return saved;
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'de') return 'de';
    return 'en';
  } catch {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('peptide_app_language', lang);
};

export const getCurrentLanguage = () => i18n.language;

export default i18n;
