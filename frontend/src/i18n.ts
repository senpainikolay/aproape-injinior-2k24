import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import enTranslations from './translations/en.json';
import roTranslations from './translations/ro.json';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations,
            },
            ro: {
                translation: roTranslations,
            },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;