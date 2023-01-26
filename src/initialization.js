import onChange from 'on-change';
import i18next from 'i18next';
import resources from './i18n/resources.js';
import {
  isValid, getRss, parseRSS, getErrorCheck, watchSeenPosts,
} from './appLogic.js';
import { render } from './render.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({ lng: 'ru', debug: false, resources });

const getNewPosts = (appState, text) => {
  const delay = 5000;
  const links = appState?.links || [];
  const promises = links.map((link) => getRss(link)
    .then((response) => parseRSS(response, appState))
    .catch(() => console.log(text)));
  setTimeout(() => {
    Promise.all(promises)
      .catch(() => console.log(text))
      .finally(() => getNewPosts(appState, text));
  }, delay);
};

const getAppRunning = () => {
  const state = {
    form: {
      status: 'pending',
      label: {
        text: '',
      },
    },
    posts: [],
    feeds: [],
    seenPosts: new Set(),
    links: [],
    errors: [],
  };
  const watchedState = onChange(state, render(state, i18nInstance));
  getNewPosts(watchedState, i18nInstance.t('texts.loading'));
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    watchedState.form.status = 'loading';
    const formData = new FormData(form);
    const inputValue = formData.get('url');
    isValid(inputValue, watchedState.links)
      .then((valid) => getErrorCheck(valid, inputValue))
      .then(() => getRss(inputValue))
      .then((rss) => {
        const parsedData = parseRSS(rss, watchedState);
        watchedState.feeds.push(parsedData.feed);
        watchedState.form.status = 'pending';
        watchedState.links.push(inputValue);
        watchedState.form.status = 'success';
        watchedState.form.label.text = i18nInstance.t('texts.success');
        const listElements = document.querySelectorAll('li');
        watchSeenPosts(listElements, watchedState);
      })
      .catch((error) => {
        watchedState.errors.push(i18nInstance.t(error.message));
        watchedState.form.status = 'error';
        watchedState.form.label.text = state.errors.at(-1);
      });
    event.preventDefault();
  });
};

export default getAppRunning;
