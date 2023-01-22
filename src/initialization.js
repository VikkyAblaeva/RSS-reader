import onChange from 'on-change';
import i18next from 'i18next';
import resources from './i18n/resources.js';
import {
  isValid, getRss, parseRSS, getNewPosts, getErrorCheck,
} from './appLogic.js';
import { renderPosts, renderFeeds, render } from './render.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({ lng: 'ru', debug: false, resources });

const getAppRunning = () => {
  const state = {
    form: {
      status: 'pending',
      label: {
        text: '',
      },
    },
    posts: [],
    seenPosts: [],
    links: [],
    errors: [],
    input: {
      value: '',
    },
  };
  const watchedState = onChange(state, render);
  getNewPosts(watchedState, i18nInstance);
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  input.focus();
  form.addEventListener('submit', (event) => {
    watchedState.form.status = 'loading';
    const formData = new FormData(form);
    formData.append('input', input.value);
    const inputValue = formData.get('input');
    isValid(inputValue, watchedState.links)
      .then((valid) => getErrorCheck(valid, inputValue))
      .then(() => getRss(inputValue))
      .then((rss) => {
        const parsedData = parseRSS(rss, watchedState);
        renderPosts(parsedData, i18nInstance, watchedState);
        renderFeeds(parsedData, i18nInstance.t('texts.feeds'));
        watchedState.form.status = 'pending';
        watchedState.links.push(inputValue);
        watchedState.form.status = 'success';
        watchedState.form.label.text = i18nInstance.t('texts.success');
        input.focus();
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
