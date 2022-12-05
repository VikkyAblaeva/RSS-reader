const renderErrorsBeforeParse = (isValid, inputValue, i18nInstance) => {
  if (inputValue === '') {
    throw new Error(i18nInstance.t('notEmpty'));
  }
  if (isValid === false) {
    throw new Error(i18nInstance.t('invalidURL'));
  }
};

const renderAfterParse = (params) => {
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

const renderErrors = (params) => {
  const [watchedformState, inputValue] = params;
  watchedformState.input.value = inputValue;
  watchedformState.label.labelClassList = 'result text-danger';
  watchedformState.input.inputClassList = 'form-control mb-2 is-invalid';
  const lastError = watchedformState.errors[watchedformState.errors.length - 1];
  watchedformState.label.innerHTML = lastError.message;
};

const buttonActive = (params) => {
  const [watchedformState] = params;
  watchedformState.button.disabled = false;
};

const buttonDisabled = (params) => {
  const [watchedformState] = params;
  watchedformState.button.disabled = true;
};

const displayNone = (params) => {
  const [watchedModalWindowState] = params;
  watchedModalWindowState.modal.style.display = 'none';
};

const displayBlock = (params) => {
  const [watchedModalWindowState] = params;
  watchedModalWindowState.modal.style.display = 'block';
};

const renderModalWindow = (params) => {
  const [watchedModalWindowState, currentPost] = params;
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

export {
  renderErrors, renderErrorsBeforeParse, renderAfterParse, renderModalWindow,
  displayNone, displayBlock, buttonActive, buttonDisabled, spinnerActive, spinnerDisabled,
};
