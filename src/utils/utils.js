import * as yup from 'yup';
import axios from 'axios';
import { watchedPostsState } from '../watchers/watchers.js';

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

const getRss = (linkToFeed, labelTexts) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(linkToFeed)}`)
  .catch(() => { throw new Error(labelTexts.networkErr); });

const parseRSS = (data, labelTexts) => {
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
    throw new Error(labelTexts.noRSS);
  }
};

const getLi = (title, link) => {
  const li = document.createElement('li');
  li.classList.add('d-flex', 'm-2', 'fs-6');
  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.setAttribute('target', '_blank');
  a.classList.add('fw-bold');
  a.textContent = title;
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'd-block', 'personal', 'col-3');
  button.textContent = 'Просмотр';
  li.append(a);
  li.append(button);
  return li;
};

const getFeeds = (normalizeFeedPosts) => {
  if (normalizeFeedPosts.filteredPosts.length === 0) return;
  const lead = document.querySelector('.lead');
  lead.textContent = 'Фиды';
  const parentFeed = lead.parentElement;
  const feedTitle = document.createElement('p');
  feedTitle.classList.add('h5', 'm-2', 'i-block', 'text-wrap');
  feedTitle.textContent = normalizeFeedPosts.feed.title;
  const feedDescription = document.createElement('p');
  feedDescription.classList.add('text-muted', 'm-2', 'i-block', 'text-wrap');
  feedDescription.textContent = normalizeFeedPosts.feed.description;
  const parent = document.createElement('div');
  parent.classList.add('m-2');
  parent.append(feedTitle);
  parent.append(feedDescription);
  parentFeed.append(parent);
};

const getPosts = (normalizeFeedPosts) => {
  if (normalizeFeedPosts.filteredPosts.length === 0) return;
  const parentPosts = document.querySelector('#posts');
  const p = document.querySelector('.display-6');
  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled');
  normalizeFeedPosts.filteredPosts.map((post) => {
    const li = getLi(post.title, post.link);
    ul.append(li);
    return li;
  });
  parentPosts.append(ul);
  p.textContent = 'Посты';
  parentPosts.classList.add('border-end', 'border-secondary', 'border-1');
  console.log(`Загружено новых постов: ${normalizeFeedPosts.filteredPosts.length}`);
};

const getParams = (element) => {
  const params = {
    classlist: Array.from(element.classList),
    tagName: element.tagName,
    id: element.id,
    parent: element.parentElement,
  };
  return params;
};

const getCurrentPost = (link) => {
  const linkTextContent = link.innerHTML;
  const currentPost = watchedPostsState.posts.map((post) => {
    if (String(post.title) === String(linkTextContent)) {
      return {
        link: post.link,
        title: post.title,
        description: post.description,
      };
    }
    return false;
  });
  const filteredPost = currentPost.filter((item) => item !== false);
  return filteredPost[0];
};

export {
  isValidURL, getRss, parseRSS, getPosts, getParams, getCurrentPost, getFeeds,
};
