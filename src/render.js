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

const renderModalWindow = (currentPost) => {
  watchedState.modal.currentPost.link = currentPost.link;
  watchedState.modal.currentPost.description = currentPost.description;
  watchedState.modal.currentPost.title = currentPost.title;
};

const findCurrentPost = (actualLink) => {
  const linkTextContent = actualLink.innerHTML;
  const currentPost = watchedState.posts.map((post) => {
    if (String(post.title) === String(linkTextContent)) {
      return {
        link: post.link,
        title: post.title,
        description: post.description,
      };
    }
    return null;
  });
  const filteredPost = currentPost.filter((item) => item !== null);
  return filteredPost[0];
};

const getLi = (title, link) => {
  const li = document.createElement('li');
  li.classList.add('d-flex', 'm-2', 'fs-6');
  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.setAttribute('target', '_blank');
  a.classList.add('fw-bold');
  a.textContent = title;
  a.addEventListener('click', () => a.classList.add('text-muted'));
  const newButton = document.createElement('button');
  newButton.setAttribute('type', 'button');
  newButton.classList.add('btn', 'btn-outline-primary', 'd-block', 'personal', 'col-3');
  newButton.textContent = 'Просмотр';
  newButton.setAttribute('type', 'button');
  newButton.addEventListener('click', () => {
    const parent = newButton.parentElement;
    const postLink = parent.querySelector('a');
    postLink.classList.add('text-muted');
    const currentPost = findCurrentPost(postLink);
    renderModalWindow(currentPost);
    modal.style.display = 'block';
  });
  li.append(a);
  li.append(newButton);
  return li;
};

const renderPosts = (normalizedFeedPosts, i18nInstance) => {
  if (normalizedFeedPosts.filteredPosts.length === 0) return;
  const parentPosts = document.querySelector('#posts');
  const p = document.querySelector('.display-6');
  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled');
  normalizedFeedPosts.filteredPosts.map((post) => {
    const li = getLi(post.title, post.link);
    ul.append(li);
    return li;
  });
  parentPosts.append(ul);
  p.textContent = i18nInstance.t('texts.posts');
  parentPosts.classList.add('border-end', 'border-secondary', 'border-1');
  console.log(`${i18nInstance.t('texts.newPosts')} ${normalizedFeedPosts.filteredPosts.length}`);
};

export { renderPosts, renderFeeds };
