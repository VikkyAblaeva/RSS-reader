import { watchedModalWindowState, watchedPostsState } from './watchers.js';

const renderAfterСheckOnExist = (params) => {
  const [watchedformState, i18nInstance, inputValue] = params;
  watchedformState.input.value = inputValue;
  if (watchedformState.links.includes(inputValue)) {
    throw new Error(i18nInstance.t('alreadyExists'));
  }
  if (!watchedformState.links.includes(inputValue)) {
    watchedformState.links.push(inputValue);
    watchedformState.label.innerHTML = i18nInstance.t('sucsess');
    watchedformState.label.labelClassList = 'result text-success';
    watchedformState.input.inputClassList = 'form-control mb-2';
    watchedformState.input.value = '';
  }
};

const renderFeeds = (normalizedFeedPosts, i18nInstance) => {
  if (normalizedFeedPosts.filteredPosts.length === 0) return;
  const lead = document.querySelector('.lead');
  lead.textContent = i18nInstance.t('feeds');
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

const renderErrors = (params) => {
  const [watchedformState, inputValue] = params;
  watchedformState.input.value = inputValue;
  watchedformState.label.labelClassList = 'result text-danger';
  watchedformState.input.inputClassList = 'form-control mb-2 is-invalid';
  const lastError = watchedformState.errors[watchedformState.errors.length - 1];
  watchedformState.label.innerHTML = lastError.message;
};

const renderModalWindow = (currentPost) => {
  watchedModalWindowState.modal.currentPost.link = currentPost.link;
  watchedModalWindowState.modal.currentPost.description = currentPost.description;
  watchedModalWindowState.modal.currentPost.title = currentPost.title;
};

const spinnerActive = (params) => {
  const [watchedSpinnerState] = params;
  watchedSpinnerState.spinner.classList = 'spinner';
  watchedSpinnerState.wrapper.classList = 'spin-wrapper';
};

const spinnerDisabled = (params) => {
  const [watchedSpinnerState] = params;
  watchedSpinnerState.spinner.classList = '';
  watchedSpinnerState.wrapper.classList = '';
};

const getLi = (title, link) => {
  const findCurrentPost = (actualLink) => {
    const linkTextContent = actualLink.innerHTML;
    const currentPost = watchedPostsState.posts.map((post) => {
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
  const li = document.createElement('li');
  li.classList.add('d-flex', 'm-2', 'fs-6');
  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.setAttribute('target', '_blank');
  a.classList.add('fw-bold');
  a.textContent = title;
  a.addEventListener('click', () => a.classList.add('text-muted'));
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'd-block', 'personal', 'col-3');
  button.textContent = 'Просмотр';
  button.setAttribute('type', 'button');
  button.addEventListener('click', () => {
    const parent = button.parentElement;
    const postLink = parent.querySelector('a');
    postLink.classList.add('text-muted');
    const currentPost = findCurrentPost(postLink);
    renderModalWindow(currentPost);
    watchedModalWindowState.modal.style.display = 'block';
  });
  li.append(a);
  li.append(button);
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
  p.textContent = i18nInstance.t('posts');
  parentPosts.classList.add('border-end', 'border-secondary', 'border-1');
  console.log(`${i18nInstance.t('newPosts')} ${normalizedFeedPosts.filteredPosts.length}`);
};

export {
  renderErrors, renderAfterСheckOnExist,
  spinnerActive, spinnerDisabled, renderPosts, renderFeeds,
};
