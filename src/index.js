import './styles.scss';
import { isValidURL, renderLabel } from './utils.js';

const input = document.querySelector('input');
input.focus();
const links = [];

const label = document.querySelector('.validResult');
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  isValidURL(input.value)
    .then((result) => {
      const render = renderLabel(input.value, result, links);
      label.innerHTML = render.label.innerHTML;
      label.classList.remove(render.label.removeClass);
      label.classList.add(render.label.addClass);
      input.classList.remove(render.input.removeClass);
      input.classList.add(render.input.addClass);
      input.value = render.input.value;
      if (input.value === '') {
        input.focus();
      }
    });
  event.preventDefault();
});
