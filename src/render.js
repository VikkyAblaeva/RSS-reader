const renderErrorsBeforeParse = (isValid, inputValue, labelTexts) => {
  if (inputValue === '') {
    throw new Error(labelTexts.empty);
  }
  if (isValid === false) {
    throw new Error(labelTexts.invalid);
  }
};

const renderAfterParse = (params) => {
  const [watchedformState, labelTexts, inputValue] = params;
  watchedformState.input.value = inputValue;
  if (watchedformState.links.includes(inputValue)) {
    throw new Error(labelTexts.exists);
  }
  if (!watchedformState.links.includes(inputValue)) {
    watchedformState.links.push(inputValue);
    watchedformState.label.innerHTML = labelTexts.valid;
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

export {
  renderErrors, renderErrorsBeforeParse, renderAfterParse, renderModalWindow,
  displayNone, displayBlock,
};
