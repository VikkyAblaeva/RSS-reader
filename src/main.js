import i18next from 'i18next';
import resources from './i18n/resources.js';
import {
  isValidURL, getRss, parseRSS, getNewPosts, getErrorCheck,
} from './appLogic.js';
import {
  renderErrors, renderAfterСheckOnExist, renderPosts,
  spinnerActive, spinnerDisabled, renderFeeds,
} from './render.js';
import {
  watchedformState, watchedModalWindowState, input, watchedSpinnerState,
} from './watchers.js';

const getAppRunning = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({ lng: 'ru', debug: false, resources });
  getNewPosts(i18nInstance);
  input.focus();
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    watchedformState.button.disabled = true;
    spinnerActive([watchedSpinnerState]);
    const inputValue = input.value;
    isValidURL(inputValue)
      .then((isValid) => getErrorCheck(isValid, inputValue, i18nInstance))
      .then(() => getRss(inputValue, i18nInstance))
      .then((rss) => parseRSS(rss, i18nInstance))
      .then((parsedData) => {
        renderPosts(parsedData, i18nInstance);
        renderFeeds(parsedData, i18nInstance);
        watchedformState.button.disabled = false;
        spinnerDisabled([watchedSpinnerState]);
      })
      .then(() => renderAfterСheckOnExist([watchedformState, i18nInstance, inputValue]))
      .catch((err) => {
        watchedformState.errors.push(err);
        spinnerDisabled([watchedSpinnerState]);
        watchedformState.button.disabled = false;
        renderErrors([watchedformState, inputValue]);
      });
    input.focus();
    event.preventDefault();
  });
  const modalWindow = document.querySelector('#myModal');
  modalWindow.addEventListener('click', (event) => {
    const eventTarget = event.target;
    if (eventTarget.id === 'closeModal') {
      watchedModalWindowState.modal.style.display = 'none';
    }
    if (eventTarget.id === 'go') {
      window.open(watchedModalWindowState.modal.currentPost.link, '_blank').focus();
    }
    if (eventTarget.classList.contains('close')) {
      watchedModalWindowState.modal.style.display = 'none';
    }
    if (eventTarget.classList.contains('modal')) {
      watchedModalWindowState.modal.style.display = 'none';
    }
  });
};

export default getAppRunning;
