import onChange from 'on-change';
import state from './states.js';

const input = document.querySelector('input');
const label = document.querySelector('.result');
const modal = document.getElementById('myModal');
const modalHeader = document.querySelector('.modal-header');
const modalTitle = modalHeader.querySelector('h2');
const modalBody = document.querySelector('.modal-body');
const button = document.querySelector('#main');
const spinner = document.querySelector('#spinner');
const wrapper = document.querySelector('#spin-wrapper');

const handleStatus = (value) => {
  switch (value) {
    case 'loading':
      button.disabled = true;
      spinner.classList = 'spinner';
      wrapper.classList = 'spin-wrapper';
      break;
    case 'pending':
      button.disabled = false;
      spinner.classList = '';
      wrapper.classList = '';
      break;
    case 'success':
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
      break;
    default:
      throw new Error(`${value}`);
  }
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      handleStatus(value);
      break;
    case 'input.value':
      input.value = value;
      break;
    case 'posts':
      break;
    case 'modal.currentPost.link':
      break;
    case 'links':
      break;
    case 'modal.currentPost.description':
      modalBody.textContent = value;
      break;
    case 'modal.currentPost.title':
      modalTitle.textContent = value;
      break;
    case 'form.label.text':
      label.innerHTML = value;
      break;
    case 'errors':
      state.form.label.text = value;
      label.innerHTML = (state.errors[state.errors.length - 1]).message;
      break;
    default:
      handleStatus('error');
  }
});

export {
  input, label, modal, watchedState,
};
