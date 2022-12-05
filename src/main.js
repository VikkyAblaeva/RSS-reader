import {
  isValidURL, getRss, parseRSS, getPosts, getFeeds, getNewPosts,
} from './appLogic.js';
import {
  renderErrors, renderErrorsBeforeParse, renderAfterParse,
  displayNone, buttonActive, buttonDisabled,
  spinnerActive, spinnerDisabled,
} from './render.js';
import {
  watchedformState, watchedModalWindowState, input, watchedSpinnerState,
} from './watchers.js';

const app = (i18nInstance) => {
  getNewPosts(i18nInstance);
  input.focus();
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    buttonDisabled([watchedformState]);
    spinnerActive([watchedSpinnerState]);
    const inputValue = input.value;
    isValidURL(inputValue)
      .then((isValid) => renderErrorsBeforeParse(isValid, inputValue, i18nInstance))
      .then(() => getRss(inputValue, i18nInstance))
      .then((rss) => parseRSS(rss, i18nInstance))
      .then((parsedData) => {
        getPosts(parsedData, i18nInstance);
        getFeeds(parsedData, i18nInstance);
        buttonActive([watchedformState]);
        spinnerDisabled([watchedSpinnerState]);
      })
      .then(() => renderAfterParse([watchedformState, i18nInstance, inputValue]))
      .catch((err) => {
        watchedformState.errors.push(err);
        spinnerDisabled([watchedSpinnerState]);
        buttonActive([watchedformState]);
        renderErrors([watchedformState, inputValue]);
      });
    input.focus();
    event.preventDefault();
  });
  const buttonCloseModalWindow = document.querySelector('#closeModal');
  buttonCloseModalWindow.addEventListener('click', () => displayNone([watchedModalWindowState]));
  const spanCloseModalWindow = document.querySelector('.close');
  spanCloseModalWindow.addEventListener('click', () => displayNone([watchedModalWindowState]));
  const modal = document.querySelector('.modal');
  modal.addEventListener('click', () => displayNone([watchedModalWindowState]));
  const buttonGo = document.querySelector('#go');
  buttonGo.addEventListener('click', () => {
    window.open(watchedModalWindowState.modal.currentPost.link, '_blank').focus();
  });
};

export default app;
