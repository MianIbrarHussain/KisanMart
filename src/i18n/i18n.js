import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import english from '../i18n/english.json';
import urdu from '../i18n/urdu.json';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  resources: {
    en: english,
    urd: urdu,
  },
  react: {
    useSuspense: false,
  },
});

export default i18next;
