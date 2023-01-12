import i18next from 'i18next';
import resources from './i18n/resources.js';
import {
  isValidURL, getRss, parseRSS, getNewPosts, getErrorCheck,
} from './appLogic.js';
import { renderPosts, renderFeeds } from './render.js';
import { input, watchedState, modal } from './watchers.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({ lng: 'ru', debug: false, resources });

const getAppRunning = () => {
  getNewPosts(i18nInstance);
  const form = document.querySelector('form');
  input.focus();
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
        watchedState.form.status = 'pending';
      })
      .then(() => {
        watchedState.input.value = inputValue;
        if (watchedState.links.includes(inputValue)) {
          throw new Error(i18nInstance.t('errors.alreadyExists'));
        }
        if (!watchedState.links.includes(inputValue)) {
          watchedState.links.push(inputValue);
          watchedState.form.status = 'success';
          watchedState.form.label.text = i18nInstance.t('texts.success');
          input.focus();
        }
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

export { getAppRunning, i18nInstance };
