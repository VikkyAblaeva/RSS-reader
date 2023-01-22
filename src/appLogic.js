import * as yup from 'yup';
import axios from 'axios';
import { uniqueId } from 'lodash';
import { renderPosts } from './render.js';

const isValid = (url, links) => {
  const validationUrl = yup.object().shape({
    website: yup.string().url(),
  });
  return validationUrl
    .validate({
      website: url,
    })
    .then(() => {
      const validationExist = yup.mixed().notOneOf(links);
      return validationExist.isValid(url);
    })
    .catch(() => { throw new Error('errors.invalidURL'); });
};

const getActualPostsTitle = (watchedState) => {
  const postTitles = watchedState.posts.map((post) => post.title);
  return postTitles;
};

const getRss = (linkToFeed) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(linkToFeed)}`)
  .catch(() => { throw new Error('errors.networkErr'); });

const getPost = ({ title, link, description }, watchedState) => {
  const actualPostsTitle = getActualPostsTitle(watchedState);
  if (actualPostsTitle.includes(title)) {
    return null;
  }
  const postId = uniqueId();
  const post = {
    title, link, description, postId,
  };
  watchedState.posts.push(post);
  return post;
};

const parseRSS = (data, watchedState) => {
  try {
    const parser = new DOMParser();
    const content = parser.parseFromString(data.data.contents, 'text/xml');
    const items = content.querySelectorAll('item');
    const posts = Array.from(items).map((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      return getPost({ title, link, description }, watchedState);
    });
    const filteredPosts = posts.filter((post) => post !== null);
    const feed = {
      title: content.querySelector('channel title').textContent,
      description: content.querySelector('channel description').textContent,
    };
    return { feed, filteredPosts };
  } catch {
    throw new Error('errors.invalidRSS');
  }
};

const getNewPosts = (watchedState, i18nInstance) => {
  const delay = 5000;
  const links = watchedState?.links || [];
  const promises = links.map((link) => getRss(link)
    .then((response) => parseRSS(response, watchedState))
    .then((newPosts) => renderPosts(newPosts, i18nInstance, watchedState))
    .catch(() => console.log(i18nInstance.t('texts.loading'))));
  setTimeout(() => {
    Promise.all(promises)
      .catch(() => console.log(i18nInstance.t('texts.loading')))
      .finally(() => getNewPosts(watchedState, i18nInstance));
  }, delay);
};

const getErrorCheck = (resultIsValid, inputValue) => {
  if (inputValue === '') {
    throw new Error('errors.notEmpty');
  }
  if (resultIsValid === false) {
    throw new Error('errors.alreadyExists');
  }
};

export {
  isValid, getRss, parseRSS, getNewPosts, getErrorCheck,
};
