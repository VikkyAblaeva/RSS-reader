import * as yup from 'yup';
import axios from 'axios';
import { watchedPostsState, watchedModalWindowState } from './watchers.js';
import { formState } from './states.js';
import { renderModalWindow, displayBlock } from './render.js';

const isValidURL = (url) => {
  const schema = yup.object().shape({
    website: yup.string().min(3).url(),
  });
  return schema
    .validate({
      website: url,
    })
    .then(() => true)
    .catch(() => false);
};

const getActualPostsTitle = () => {
  const postTitles = watchedPostsState.posts.map((post) => post.title);
  return postTitles;
};

const getRss = (linkToFeed, i18nInstance) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(linkToFeed)}`)
  .catch(() => { throw new Error(i18nInstance.t('networkErr')); });

const parseRSS = (data, i18nInstance) => {
  try {
    const parser = new DOMParser();
    const content = parser.parseFromString(data.data.contents, 'text/xml');
    const actualPostsTitle = getActualPostsTitle();
    const items = content.querySelectorAll('item');
    const posts = Array.from(items).map((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      if (actualPostsTitle.includes(title)) return '';
      const post = { title, link, description };
      watchedPostsState.posts.push(post);
      return post;
    });
    const filteredPosts = posts.filter((post) => post !== '');
    const feed = {
      title: content.querySelector('channel title').textContent,
      description: content.querySelector('channel description').textContent,
    };
    return { feed, filteredPosts };
  } catch {
    throw new Error(i18nInstance.t('invalidRSS'));
  }
};

const findCurrentPost = (link) => {
  const linkTextContent = link.innerHTML;
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

const getLi = (title, link) => {
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
    renderModalWindow([watchedModalWindowState, currentPost]);
    displayBlock([watchedModalWindowState]);
  });
  li.append(a);
  li.append(button);
  return li;
};

const getFeeds = (normalizedFeedPosts, i18nInstance) => {
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

const getPosts = (normalizedFeedPosts, i18nInstance) => {
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

const getNewPosts = (i18nInstance) => {
  const delay = 5000;
  const promises = formState?.links.map((link) => getRss(link, i18nInstance)
    .then((response) => parseRSS(response, i18nInstance))
    .then((newPosts) => getPosts(newPosts, i18nInstance))
    .catch(() => console.log(i18nInstance.t('loading'))));
  setTimeout(() => {
    Promise.all(promises)
      .catch(() => console.log(i18nInstance.t('loading')))
      .finally(() => getNewPosts(i18nInstance));
  }, delay);
};

export {
  isValidURL, getRss, parseRSS, getPosts, findCurrentPost, getFeeds, getNewPosts,
};
