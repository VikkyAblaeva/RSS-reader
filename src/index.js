import i18next from 'i18next';
import './styles.scss';
import onChange from 'on-change';
import {
  isValidURL, getRss, parseRSS, getPostsAndFeeds,
} from './utils.js';
import resources from './i18n/resources.js';
import { renderErrors, renderErrorsBeforeParse, renderAfterParse } from './render.js';

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
  const formState = {
    input: {
      value: '',
      inputClassList: '',
    },
    label: {
      innerHTML: '',
      labelClassList: '',
    },
    links: [],
    errors: [],
  };

  const input = document.querySelector('input');
  input.focus();
  const label = document.querySelector('.result');
  const watchedformState = onChange(formState, (path, value) => {
    switch (path) {
      case 'label.innerHTML':
        label.innerHTML = value;
        break;
      case 'label.labelClassList':
        label.classList = value;
        break;
      case 'input.value':
        input.value = value;
        break;
      case 'input.inputClassList':
        input.classList = value;
        break;
    }
  });

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
    const eventTargetTagName = eventTarget.tagName;
    if (eventTargetTagName === 'A') {
      eventTarget.classList.add('text-muted');
    }
    if (Array.from(eventTarget.classList).includes('btn-outline-primary')) {
      const parentEventTargetElement = eventTarget.parentElement;
      const link = parentEventTargetElement.querySelector('a');
      link.classList.add('text-muted');
      //здесь будет модальное окно
    }
  });
};

app();
