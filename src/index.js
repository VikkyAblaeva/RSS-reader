import i18next from 'i18next';
import './styles/styles.scss';
import {
  isValidURL, getRss, parseRSS, getPosts, getParams, getCurrentPost, getFeeds,
} from './utils/utils.js';
import resources from './i18n/resources.js';
import {
  renderErrors, renderErrorsBeforeParse, renderAfterParse, renderModalWindow,
  displayNone, displayBlock,
} from './render/render.js';
import {
  watchedformState, watchedModalWindowState, input,
} from './watchers/watchers.js';
import { formState } from './states/states.js';

const app = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({ lng: 'ru', debug: false, resources });
  const labelTexts = {
    valid: i18nInstance.t('sucsess'),
    invalid: i18nInstance.t('invalidURL'),
    exists: i18nInstance.t('alreadyExists'),
    empty: i18nInstance.t('notEmpty'),
    noRSS: i18nInstance.t('invalidRSS'),
    networkErr: i18nInstance.t('networkErr'),
    loading: i18nInstance.t('loading'),
  };
  const delay = 5000;
  setTimeout(function request() {
    formState?.links.map((link) => getRss(link, labelTexts)
      .then((response) => parseRSS(response, labelTexts))
      .then((newPosts) => getPosts(newPosts))
      .catch(() => console.log(labelTexts.loading)));
    setTimeout(request, delay);
  }, delay);
  input.focus();
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    const inputValue = input.value;
    isValidURL(inputValue)
      .then((isValid) => renderErrorsBeforeParse(isValid, inputValue, labelTexts))
      .then(() => getRss(inputValue, labelTexts))
      .then((rss) => parseRSS(rss, labelTexts))
      .then((parsedData) => {
        getPosts(parsedData);
        getFeeds(parsedData);
      })
      .then(() => renderAfterParse([watchedformState, labelTexts, inputValue]))
      .catch((err) => {
        watchedformState.errors.push(err);
        renderErrors([watchedformState, inputValue]);
      });
    input.focus();
    event.preventDefault();
  });
  document.addEventListener('click', (event) => {
    const eventTarget = event.target;
    const params = getParams(eventTarget);
    if (params.tagName === 'A') {
      eventTarget.classList.add('text-muted');
    }
    if (params.parent.tagName === 'LI' && params.tagName === 'BUTTON') {
      const link = params.parent.querySelector('a');
      link.classList.add('text-muted');
      const currentPost = getCurrentPost(link);
      renderModalWindow([watchedModalWindowState, currentPost]);
      displayBlock([watchedModalWindowState]);
    }
    if (params.classlist.includes('close') || params.classlist.includes('modal') || params.id === 'closeModal') {
      displayNone([watchedModalWindowState]);
    }
    if (params.id === 'go') {
      window.open(watchedModalWindowState.modal.currentPost.link, '_blank').focus();
    }
  });
};

app();
