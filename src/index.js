import i18next from 'i18next';
import './styles.scss';
import {
  isValidURL, getRss, parseRSS, getPostsAndFeeds, getParams, getCurrentPost,
} from './utils.js';
import resources from './i18n/resources.js';
import {
  renderErrors, renderErrorsBeforeParse, renderAfterParse, renderModalWindow,
} from './render.js';
import {
  watchedformState, watchedModalWindowState, watchedPostsState, input,
  label, modal,
} from './watchers/watchers.js';

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
  };
  input.focus();
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    const inputValue = input.value;
    isValidURL(inputValue)
      .then((isValid) => renderErrorsBeforeParse(isValid, inputValue, labelTexts))
      .then(() => getRss(inputValue))
      .then((rss) => parseRSS(rss, labelTexts))
      .then((parsedData) => getPostsAndFeeds(parsedData))
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
      console.log(currentPost);
      renderModalWindow([watchedModalWindowState, 'block', currentPost]);
    }
    //if (params.classlist.includes('close') || params.classlist.includes('modal') || params.id === 'closeModal') {
      //renderModalWindow([watchedModalWindowState, 'none', {}]);
    //}
    if (params.id === 'go') {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank').focus();
    }
  });
};

app();
