import i18next from 'i18next';
import './styles.scss';
import {
  isValidURL, getRss, parseRSS, getPostsAndFeeds,
} from './utils.js';
import resources from './i18n/resources.js';
import { renderErrors, renderErrorsBeforeParse, renderAfterParse } from './render.js';
import { formState } from './states/states.js';
import { watchedformState, input, label } from './watchers/watchers.js';

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
  const modal = document.getElementById('myModal');
  document.addEventListener('click', (event) => {
    const eventTarget = event.target;
    const eventTargetClasslist = Array.from(eventTarget.classList);
    const eventTargetTagName = eventTarget.tagName;
    const eventTargetId = eventTarget.id;
    if (eventTargetTagName === 'A') {
      eventTarget.classList.add('text-muted');
    }
    const parentEventTarget = eventTarget.parentElement;
    if (parentEventTarget.tagName === 'LI') {
      const link = parentEventTarget.querySelector('a');
      link.classList.add('text-muted');
      modal.style.display = "block";
    }
    if (eventTargetClasslist.includes('close') || eventTargetClasslist.includes('modal') || eventTargetId === 'closeModal') {
      modal.style.display = "none";
    }
  });
};

app();
