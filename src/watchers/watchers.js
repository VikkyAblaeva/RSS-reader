import onChange from 'on-change';
import formState from '../states/states.js';

const input = document.querySelector('input');
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
    default:
      console.log('Unknown state');
  }
});

export { watchedformState, input, label };
