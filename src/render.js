import { modal, watchedState } from './watchers.js';

const renderFeeds = (normalizedFeedPosts, i18nInstance) => {
  if (normalizedFeedPosts.filteredPosts.length === 0) return;
  const lead = document.querySelector('.lead');
  lead.textContent = i18nInstance.t('texts.feeds');
  const parentFeed = lead.parentElement;
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

const getButton = () => {
  const newButton = document.createElement('button');
  newButton.setAttribute('type', 'button');
  newButton.classList.add('btn', 'btn-outline-primary', 'd-block', 'personal', 'col-3');
  newButton.textContent = 'Просмотр';
  newButton.setAttribute('type', 'button');
  return newButton;
};

const getElementA = (title, link) => {
  const elementA = document.createElement('a');
  elementA.setAttribute('href', link);
  elementA.setAttribute('target', '_blank');
  elementA.classList.add('fw-bold');
  elementA.textContent = title;
  return elementA;
};

const getNodeElementOfPost = (title, link) => {
  const li = document.createElement('li');
  li.classList.add('d-flex', 'm-2', 'fs-6');
  const a = getElementA(title, link);
  a.addEventListener('click', () => a.classList.add('text-muted'));
  const nodeButton = getButton();
  nodeButton.addEventListener('click', () => {
    const parent = nodeButton.parentElement;
    const postLink = parent.querySelector('a');
    postLink.classList.add('text-muted');
    const linkTextContent = postLink.innerHTML;
    const currentPost = watchedState.posts.find((post) => String(post.title) === linkTextContent);
    watchedState.modal.currentPost.link = currentPost.link;
    watchedState.modal.currentPost.description = currentPost.description;
    watchedState.modal.currentPost.title = currentPost.title;
    modal.style.display = 'block';
  });
  li.append(a);
  li.append(nodeButton);
  return li;
};

const renderPosts = (normalizedFeedPosts, i18nInstance) => {
  if (normalizedFeedPosts.filteredPosts.length === 0) return;
  const parentPosts = document.querySelector('#posts');
  const p = document.querySelector('.display-6');
  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled');
  normalizedFeedPosts.filteredPosts.map((post) => {
    const li = getNodeElementOfPost(post.title, post.link);
    ul.append(li);
    return li;
  });
  parentPosts.append(ul);
  p.textContent = i18nInstance.t('texts.posts');
  parentPosts.classList.add('border-end', 'border-secondary', 'border-1');
  console.log(`${i18nInstance.t('texts.newPosts')} ${normalizedFeedPosts.filteredPosts.length}`);
};

export { renderPosts, renderFeeds };
