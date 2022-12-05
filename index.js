import i18next from 'i18next';
import resources from './src/i18n/resources.js';
import './src/styles/styles.scss';
import app from './src/main.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({ lng: 'ru', debug: false, resources });

app(i18nInstance);
