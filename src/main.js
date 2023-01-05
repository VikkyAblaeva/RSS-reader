import i18next from 'i18next';
import resources from './i18n/resources.js';
import {
  isValidURL, getRss, parseRSS, getNewPosts, getErrorCheck,
} from './appLogic.js';
import {
  renderAfterСheckOnExist, renderPosts,
  renderFeeds,
} from './render.js';
import { input, watchedState, modal } from './watchers.js';

const getAppRunning = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({ lng: 'ru', debug: false, resources });
  getNewPosts(i18nInstance);
  const form = document.querySelector('form');
  watchedState.form.status = 'init';
  form.addEventListener('submit', (event) => {
    watchedState.form.status = 'loading';
    const inputValue = input.value;
    isValidURL(inputValue)
      .then((isValid) => getErrorCheck(isValid, inputValue, i18nInstance))
      .then(() => getRss(inputValue, i18nInstance))
      .then((rss) => parseRSS(rss, i18nInstance))
      .then((parsedData) => {
        renderPosts(parsedData, i18nInstance);
        renderFeeds(parsedData, i18nInstance);
        watchedState.form.status = 'uploaded';
      })
      .then(() => {
        renderAfterСheckOnExist([i18nInstance, inputValue]);
      })
      .catch((err) => {
        watchedState.input.value = inputValue;
        watchedState.errors.push(err);
        watchedState.form.status = 'error';
      });
    event.preventDefault();
  });
  modal.addEventListener('click', (event) => {
    const eventTarget = event.target;
    if (eventTarget.id === 'closeModal' || eventTarget.classList.contains('close')
    || eventTarget.classList.contains('modal')) {
      modal.style.display = 'none';
    }
    if (eventTarget.id === 'go') {
      window.open(watchedState.modal.currentPost.link, '_blank').focus();
    }
  });
};

export default getAppRunning;
