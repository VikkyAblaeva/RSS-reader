import i18next from 'i18next';
import './styles.scss';
import { isValidURL } from './utils.js';
import resources from './i18n/resources.js';

const renderForm = (params) => {
  if (params.isValid === true && !params.links.includes(params.inputValue)) {
    params.links.push(params.inputValue);
    params.label.innerHTML = params.labelTexts.valid;
    params.label.className = 'result text-success';
    params.input.value = '';
    params.input.className = 'form-control mb-2';
    return;
  }
  if (params.inputValue === '') {
    params.label.innerHTML = params.labelTexts.empty;
    params.label.className = 'result text-dark';
    return;
  }
  if (params.isValid === true && params.links.includes(params.inputValue)) {
    params.label.innerHTML = params.labelTexts.exists;
    params.label.className = 'result text-danger';
    params.input.className = 'form-control mb-2 is-invalid';
    return;
  }
  params.label.innerHTML = params.labelTexts.invalid;
  params.label.className = 'result text-danger';
  params.input.className = 'form-control mb-2 is-invalid';
};

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
        renderForm({ inputValue, isValid, labelTexts, label, input, links });
        if (inputValue === '') {
          input.focus();
        }
      });
    event.preventDefault();
  });
};

app();
