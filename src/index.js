import i18next from 'i18next';
import './styles.scss';
import { isValidURL, getRss, parseRSS, getPostsAndFeeds, renderForm } from './utils.js';
import resources from './i18n/resources.js';

const app = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({ lng: 'ru', debug: false, resources });
  const labelTexts = {
    valid: i18nInstance.t('sucsess'),
    invalid: i18nInstance.t('invalidURL'),
    exists: i18nInstance.t('alreadyExists'),
    empty: i18nInstance.t('notEmpty'),
  };
  const links = [];
  const input = document.querySelector('input');
  input.focus();
  const label = document.querySelector('.result');
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    const inputValue = input.value;
    isValidURL(inputValue)
      .then((isValid) => {
        return renderForm({ inputValue, isValid, labelTexts, label, input, links });
      });
    getRss(inputValue)
          .then(data => {
              return parseRSS(data);
          })
      .then((normalizeFeedPosts) => {
        getPostsAndFeeds(normalizeFeedPosts)
      })
        if (inputValue === '') {
          input.focus();
        }
        event.preventDefault();
      });
};

app();
