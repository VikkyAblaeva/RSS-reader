import { Modal } from 'bootstrap';

const renderFeeds = (normalizedFeedPosts, text) => {
  if (normalizedFeedPosts.filteredPosts.length === 0) return;
  const description = document.querySelector('.description');
  description.textContent = text;
  const parentFeed = description.parentElement;
  const feedTitle = document.createElement('p');
  feedTitle.classList.add('h5', 'm-2', 'i-block', 'text-wrap');
  feedTitle.textContent = normalizedFeedPosts.feed.title;
  const feedDescription = document.createElement('p');
  feedDescription.classList.add('text-muted', 'm-2', 'i-block', 'text-wrap');
  feedDescription.textContent = normalizedFeedPosts.feed.description;
  const parent = document.createElement('div');
  parent.classList.add('m-2');
  parent.append(feedTitle);
  parent.append(feedDescription);
  parentFeed.append(parent);
};

const getButton = (i18nInstance) => {
  const newButton = document.createElement('button');
  newButton.setAttribute('type', 'button');
  newButton.classList.add('btn', 'btn-outline-primary', 'd-block', 'personal', 'col-3');
  newButton.textContent = i18nInstance.t('button.name');
  newButton.setAttribute('type', 'button');
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

const showModal = (currentPost) => {
  const modalNode = document.getElementById('myModal');
  const modal = new Modal(modalNode);
  const modalHeader = document.querySelector('.modal-header');
  const modalTitle = modalHeader.querySelector('h2');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = modalNode.querySelector('a');
  modalLink.setAttribute('href', currentPost.link);
  modalTitle.textContent = currentPost.title;
  modalBody.textContent = currentPost.description;
  modal.show();
};

const handleSeenPosts = (watchedState) => {
  watchedState.posts.map((post) => {
    if (watchedState.seenPosts.includes(post.postId)) {
      const seenPost = document.getElementById(post.postId);
      seenPost.classList.add('text-muted');
    }
    return post;
  });
};

const getNodeElementOfPost = (post, i18nInstance, watchedState) => {
  const li = document.createElement('li');
  li.classList.add('d-flex', 'm-2', 'fs-6');
  const linkToThePost = getElementA(post);
  const nodeButton = getButton(i18nInstance);
  li.append(linkToThePost);
  li.append(nodeButton);
  const currentPost = watchedState.posts.find((item) => String(post.title) === item.title);
  li.addEventListener('click', () => {
    watchedState.seenPosts.push(currentPost.postId);
    const set = new Set(watchedState.seenPosts);
    watchedState.seenPosts.splice(0, watchedState.seenPosts.length, ...Array.from(set));
    handleSeenPosts(watchedState);
  });
  nodeButton.addEventListener('click', () => showModal(currentPost));
  return li;
};

const renderPosts = (normalizedFeedPosts, i18nInstance, watchedState) => {
  if (normalizedFeedPosts.filteredPosts.length === 0) return;
  const parentPosts = document.querySelector('#posts');
  const p = document.querySelector('.display-6');
  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled');
  normalizedFeedPosts.filteredPosts.map((post) => {
    const li = getNodeElementOfPost(post, i18nInstance, watchedState);
    ul.append(li);
    return li;
  });
  parentPosts.append(ul);
  p.textContent = i18nInstance.t('texts.posts');
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

const render = (path, value) => {
  const label = document.querySelector('.result');
  switch (path) {
    case 'form.status':
      handleStatus(value);
      break;
    case 'form.label.text':
      label.innerHTML = value;
      break;
    default:
      break;
  }
};

export {
  renderPosts, renderFeeds, showModal, render,
};
