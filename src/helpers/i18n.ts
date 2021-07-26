import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationNB from '../locales/en-US/translation.json';

// the translations
const resources = {
    'en-US': {
        translation: translationNB,
    },
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'nb-NO',

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
