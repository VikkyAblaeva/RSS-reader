import onChange from 'on-change';
import state from './states.js';

const input = document.querySelector('input');
const label = document.querySelector('.result');
const modal = document.getElementById('myModal');
const modalHeader = document.querySelector('.modal-header');
const h2 = modalHeader.querySelector('h2');
const modalBody = document.querySelector('.modal-body');
const button = document.querySelector('#main');
const spinner = document.querySelector('#spinner');
const wrapper = document.querySelector('#spin-wrapper');

const handleForm = (value) => {
  switch (value) {
    case 'init':
      input.focus();
      break;
    case 'loading':
      button.disabled = true;
      spinner.classList = 'spinner';
      wrapper.classList = 'spin-wrapper';
      break;
    case 'uploaded':
      button.disabled = false;
      spinner.classList = '';
      wrapper.classList = '';
      break;
    case 'sucsess':
      label.classList = 'result text-success';
      input.classList = 'form-control mb-2';
      input.value = '';
      break;
    case 'error':
      button.disabled = false;
      spinner.classList = '';
      wrapper.classList = '';
      label.classList = 'result text-danger';
      input.classList = 'form-control mb-2 is-invalid';
      label.innerHTML = (state.errors[state.errors.length - 1]).message;
      break;
    default:
      break;
  }
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      handleForm(value);
      break;
    case 'watchedState.posts':
      state.posts.push(value);
      break;
    case 'modal.currentPost.description':
      modalBody.textContent = value;
      break;
    case 'modal.currentPost.title':
      h2.textContent = value;
      break;
    default:
      break;
  }
});

export {
  input, label, modal, watchedState,
};
