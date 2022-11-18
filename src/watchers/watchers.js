import onChange from 'on-change';
import { formState, modalWindowState, postsState } from '../states/states.js';

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
      break;
  }
});
const modal = document.getElementById('myModal');

const watchedModalWindowState = onChange(modalWindowState, (path, value) => {
  const modalHeader = document.querySelector('.modal-header');
  const h2 = modalHeader.querySelector('h2');
  const modalBody = document.querySelector('.modal-body');
  switch (path) {
    case 'modal.style.display':
      modal.style.display = value;
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

const watchedPostsState = onChange(postsState, (path, value) => {
  switch (path) {
    case 'watchedPostsState.posts':
      postsState.posts.push(value);
      break;
    case 'watchedPostsState.currentPost.link':
      postsState.currentPost.link = 'value';
      break;
    case 'watchedPostsState.currentPost.title':
      postsState.currentPost.title = 'value';
      break;
    case 'watchedPostsState.currentPost.description':
      postsState.currentPost.description = 'value';
      break;
    default:
      break;
  }
});

export {
  watchedformState, watchedModalWindowState, watchedPostsState, input,
  label, modal,
};
