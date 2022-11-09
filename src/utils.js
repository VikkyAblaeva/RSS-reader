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

const renderForm = (params) => {
  if (params.isValid === true && !params.links.includes(params.inputValue)) {
    params.links.push(params.inputValue);
    params.label.innerHTML = params.labelTexts.valid;
    params.label.className = 'result text-success';
    params.input.value = '';
    params.input.className = 'form-control mb-2';
    return;
  }
  if (params.inputValue === '') {
    params.label.innerHTML = params.labelTexts.empty;
    params.label.className = 'result text-dark';
    return;
  }
  if (params.isValid === true && params.links.includes(params.inputValue)) {
    params.label.innerHTML = params.labelTexts.exists;
    params.label.className = 'result text-danger';
    params.input.className = 'form-control mb-2 is-invalid';
    return;
  }
  params.label.innerHTML = params.labelTexts.invalid;
  params.label.className = 'result text-danger';
  params.input.className = 'form-control mb-2 is-invalid';
};

const getRss = (linkToFeed) => {
  return axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(linkToFeed)}`)
  .catch(() => { throw Error('networkError')})
};
//http://feeds.feedburner.com/Astrobene
const parseRSS = (data) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(data.data.contents, "text/xml");
  const feed = {
    title: content.querySelector('channel title').textContent,
    description: content.querySelector('channel description').textContent,
  };
  const items = content.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    return {
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
      watch: false,
    };
  })
  return { feed, posts };
};

const getPostsAndFeeds = (normalizeFeedPosts) => {
  const parentPosts = document.querySelector('#posts');
  parentPosts.classList.add('border-end', 'border-secondary', 'border-2');
  const p = document.querySelector('.display-6');
  p.textContent = 'Посты';
  const lead = document.querySelector('.lead');
  const feedTitle = document.querySelector('.h5');
  const feedDescription = document.querySelector('.text-muted');
  lead.textContent = 'Фиды'; // сделать, чтобы добавлялось несколько
  feedTitle.textContent = normalizeFeedPosts.feed.title; // сделать, чтобы добавлялось несколько
  feedDescription.textContent = normalizeFeedPosts.feed.description; // сделать, чтобы добавлялось несколько
  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled');
  normalizeFeedPosts.posts.map((post) => {
    const li = document.createElement('li');
    li.classList.add('.d-block', 'm-2', 'fs-6', 'row');
    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');
    a.classList.add('.d-block', 'col-10', 'bold-text');
    a.textContent = post.title;
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('.d-block', 'btn', 'btn-outline-primary', 'col-2');
    button.textContent = 'Просмотр';
    li.append(a);
    li.append(button);
    ul.append(li);
  });
  parentPosts.append(ul);
}

export { isValidURL, getRss, parseRSS, getPostsAndFeeds, renderForm };
