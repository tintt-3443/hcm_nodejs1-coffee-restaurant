import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // English translations here...
          hello: 'Hello',
          goodbye: 'Goodbye',
        },
      },
      vi: {
        translation: {
          // Vietnamese translations here...
          hello: 'Xin chào',
          goodbye: 'Tạm biệt',
        },
      },
    },
  });

export default i18n;
