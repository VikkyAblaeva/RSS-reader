import * as yup from 'yup';
import axios from 'axios';
import { watchedPostsState } from './watchers.js';
import { formState } from './states.js';
import { renderPosts } from './render.js';

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

const getNewPosts = (i18nInstance) => {
  const delay = 5000;
  const promises = formState?.links.map((link) => getRss(link, i18nInstance)
    .then((response) => parseRSS(response, i18nInstance))
    .then((newPosts) => renderPosts(newPosts, i18nInstance))
    .catch(() => console.log(i18nInstance.t('loading'))));
  setTimeout(() => {
    Promise.all(promises)
      .catch(() => console.log(i18nInstance.t('loading')))
      .finally(() => getNewPosts(i18nInstance));
  }, delay);
};

const getErrorCheck = (isValid, inputValue, i18nInstance) => {
  if (inputValue === '') {
    throw new Error(i18nInstance.t('notEmpty'));
  }
  if (isValid === false) {
    throw new Error(i18nInstance.t('invalidURL'));
  }
};

export {
  isValidURL, getRss, parseRSS, getNewPosts, getErrorCheck,
};
