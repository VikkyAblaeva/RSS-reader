import * as yup from 'yup';
import axios from 'axios';

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

const getRss = (linkToFeed) => {
  return axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(linkToFeed)}`)
  .catch(() => { throw new Error('networkError') })
};

//http://feeds.feedburner.com/Astrobene
const parseRSS = (data, labelTexts) => {
  try {
    const parser = new DOMParser();
    const content = parser.parseFromString(data.data.contents, 'text/xml');
    const feed = {
      title: content.querySelector('channel title').textContent,
      description: content.querySelector('channel description').textContent,
    };
    const items = content.querySelectorAll('item');
    const posts = Array.from(items).map((item) => {
      const post = {
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
        watch: false,
      };
      return post;
    });
    return { feed, posts };
  } catch {
    throw new Error(labelTexts.noRSS);
  }
};

const getLi = (title, link) => {
  const li = document.createElement('li');
  li.classList.add('d-flex', 'm-2', 'fs-6', 'row', 'i-block', 'justify-content-between');
  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.setAttribute('target', '_blank');
  a.classList.add('i-block', 'bold-text', 'col-10');
  a.textContent = title;
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-lg', 'i-block', 'col-2');
  button.textContent = 'Просмотр';
  li.append(a);
  li.append(button);
  return li;
};

const getFeed = (title, description) => {
  const feedTitle = document.createElement('p');
  feedTitle.classList.add('h5', 'm-2', 'i-block');
  feedTitle.textContent = title;
  const feedDescription = document.createElement('p');
  feedDescription.classList.add('text-muted', 'm-2', 'i-block');
  feedDescription.textContent = description;
  const parent = document.createElement('div');
  parent.classList.add('m-2');
  parent.append(feedTitle);
  parent.append(feedDescription);
  return parent;
};

const getPostsAndFeeds = (normalizeFeedPosts) => {
  const parentPosts = document.querySelector('#posts');
  const p = document.querySelector('.display-6');
  const lead = document.querySelector('.lead');
  const parentFeed = lead.parentElement;
  const feed = getFeed(normalizeFeedPosts.feed.title, normalizeFeedPosts.feed.description);
  parentFeed.append(feed);
  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled');
  normalizeFeedPosts.posts.map((post) => {
    const li = getLi(post.title, post.link);
    ul.append(li);
  });
  parentPosts.append(ul);
  p.textContent = 'Посты';
  lead.textContent = 'Фиды';
  parentPosts.classList.add('border-end', 'border-secondary', 'border-2');
};

export {
  isValidURL, getRss, parseRSS, getPostsAndFeeds,
};
