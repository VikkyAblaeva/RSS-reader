import { Modal } from 'bootstrap';

const getButton = (buttonTitle) => {
  const newButton = document.createElement('button');
  newButton.setAttribute('type', 'button');
  newButton.classList.add('btn', 'btn-outline-primary', 'd-block', 'personal', 'col-3');
  newButton.textContent = buttonTitle;
  newButton.setAttribute('type', 'button');
  newButton.addEventListener('click', () => {
    const modalNode = document.getElementById('myModal');
    const modal = new Modal(modalNode);
    modal.show();
  });
  return newButton;
};

const getElementA = (post) => {
  const elementA = document.createElement('a');
  elementA.setAttribute('href', post.link);
  elementA.setAttribute('target', '_blank');
  elementA.classList.add('fw-bold');
  elementA.setAttribute('id', post.postId);
  elementA.textContent = post.title;
  return elementA;
};

const renderModal = (currentPost) => {
  const modalNode = document.getElementById('myModal');
  const modalHeader = document.querySelector('.modal-header');
  const modalTitle = modalHeader.querySelector('h2');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = modalNode.querySelector('a');
  modalLink.setAttribute('href', currentPost.link);
  modalTitle.textContent = currentPost.title;
  modalBody.textContent = currentPost.description;
};

const handleSeenPosts = (state, value) => {
  const { seenPosts } = state;
  const { posts } = state;
  posts.forEach((post) => {
    if (seenPosts.has(post.postId)) {
      const seenPost = document.getElementById(post.postId);
      seenPost.classList.add('text-muted');
    }
  });
  const lastSeenId = Array.from(value).at(-1);
  const lastSeenPost = state.posts.find((post) => post.postId === lastSeenId);
  renderModal(lastSeenPost);
};

const getNodeElementOfPost = (post, buttonTitle) => {
  const li = document.createElement('li');
  li.classList.add('d-flex', 'm-2', 'fs-6');
  const linkToThePost = getElementA(post);
  const nodeButton = getButton(buttonTitle);
  li.append(linkToThePost);
  li.append(nodeButton);
  return li;
};

const renderPost = (post, [titleText, buttonTitle]) => {
  if (post.length === 0) return;
  const parentPosts = document.querySelector('#posts');
  const p = document.querySelector('.display-6');
  const ul = document.querySelector('.list-unstyled');
  const li = getNodeElementOfPost(post, buttonTitle);
  ul.append(li);
  parentPosts.append(ul);
  p.textContent = titleText;
  parentPosts.classList.add('border-end', 'border-secondary', 'border-1');
};

const handleStatus = (status) => {
  const input = document.querySelector('input');
  const label = document.querySelector('.result');
  const button = document.querySelector('#main');
  const spinner = document.querySelector('#spinner');
  const wrapper = document.querySelector('#spin-wrapper');
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

const renderFeeds = (feed, text) => {
  const description = document.querySelector('.description');
  description.textContent = text;
  const parentFeed = description.parentElement;
  const feedTitle = document.createElement('p');
  feedTitle.classList.add('h5', 'm-2', 'i-block', 'text-wrap');
  feedTitle.textContent = feed.title;
  const feedDescription = document.createElement('p');
  feedDescription.classList.add('text-muted', 'm-2', 'i-block', 'text-wrap');
  feedDescription.textContent = feed.description;
  const parent = document.createElement('div');
  parent.classList.add('m-2');
  parent.append(feedTitle);
  parent.append(feedDescription);
  parentFeed.append(parent);
};

const render = (state, i18nInstance) => (path, value) => {
  const label = document.querySelector('.result');
  switch (path) {
    case 'form.status':
      handleStatus(value);
      break;
    case 'form.label.text':
      label.innerHTML = value;
      break;
    case 'seenPosts':
      handleSeenPosts(state, value);
      break;
    case 'feeds':
      renderFeeds(value.at(-1), i18nInstance.t('texts.feeds'));
      break;
    case 'posts':
      renderPost(value.at(-1), [i18nInstance.t('texts.posts'), i18nInstance.t('button.name')]);
      break;
    default:
      break;
  }
};

export {
  renderFeeds, render,
};
