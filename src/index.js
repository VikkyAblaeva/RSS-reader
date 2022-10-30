import './styles.scss';
import { isValidURL, renderForm } from './utils.js';

const input = document.querySelector('input');
input.focus();
const links = [];

const label = document.querySelector('.validResult');
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  isValidURL(input.value)
    .then((result) => {
      const render = renderForm(input.value, result, links);
      label.innerHTML = render.label.innerHTML;
      label.classList.add(render.label.addClass);
      label.classList.remove(render.label.removeClass);
      input.classList.add(render.input.addClass);
      input.classList.remove(render.input.removeClass);
      input.value = render.input.value;
      if (input.value === '') {
        input.focus();
      }
    });
  event.preventDefault();
});
