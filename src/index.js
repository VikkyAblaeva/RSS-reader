import './styles.scss';
import { isValidURL, renderForm } from './utils.js';

const input = document.querySelector('input');
input.focus();
const links = [];

const label = document.querySelector('.result');
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  isValidURL(input.value)
    .then((result) => {
      const render = renderForm(input.value, result, links);
      input.value = render.input.value;
      input.className = render.input.className;
      label.innerHTML = render.label.text;
      label.className = render.label.className;
      if (input.value === '') {
        input.focus();
      }
    });
  event.preventDefault();
});
