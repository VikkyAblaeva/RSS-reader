import onChange from 'on-change';
import state from './state.js';

const input = document.querySelector('input');
const label = document.querySelector('.result');
const button = document.querySelector('#main');
const spinner = document.querySelector('#spinner');
const wrapper = document.querySelector('#spin-wrapper');

const handleStatus = (status) => {
  switch (status) {
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
      throw new Error(status);
  }
};

const handleSeenPosts = () => {
  state.posts.map((post) => {
    if (state.seenPosts.includes(post.postId)) {
      const seenPost = document.getElementById(post.postId);
      seenPost.classList.add('text-muted');
    }
    return post;
  });
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      handleStatus(value);
      break;
    case 'form.label.text':
      label.innerHTML = value;
      break;
    case 'errors':
      state.form.label.text = value;
      label.innerHTML = (state.errors.at(-1)).message;
      break;
    case 'seenPosts':
      handleSeenPosts();
      break;
    default:
      break;
  }
});

export {
  input, label, watchedState,
};
