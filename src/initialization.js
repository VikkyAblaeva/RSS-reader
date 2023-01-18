import i18next from 'i18next';
import resources from './i18n/resources.js';
import {
  isValid, getRss, parseRSS, getNewPosts, getErrorCheck,
} from './appLogic.js';
import { renderPosts, renderFeeds } from './render.js';
import { input, watchedState } from './watchers.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({ lng: 'ru', debug: false, resources });

const getAppRunning = () => {
  getNewPosts(i18nInstance);
  const form = document.querySelector('form');
  input.focus();
  form.addEventListener('submit', (event) => {
    watchedState.form.status = 'loading';
    const inputValue = input.value;
    isValid(inputValue, i18nInstance)
      .then((valid) => getErrorCheck(valid, inputValue, i18nInstance))
      .then(() => getRss(inputValue, i18nInstance))
      .then((rss) => parseRSS(rss, i18nInstance))
      .then((parsedData) => {
        renderPosts(parsedData, i18nInstance);
        renderFeeds(parsedData, i18nInstance);
        watchedState.form.status = 'pending';
        watchedState.links.push(inputValue);
        watchedState.form.status = 'success';
        watchedState.form.label.text = i18nInstance.t('texts.success');
        input.focus();
      })
      .catch((error) => {
        watchedState.errors.push(error);
        watchedState.form.status = 'error';
      });
    event.preventDefault();
  });
};

export { getAppRunning, i18nInstance };
