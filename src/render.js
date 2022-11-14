const renderErrorsBeforeParse = (isValid, inputValue, labelTexts) => {
  if (inputValue === '') {
    throw new Error(labelTexts.empty);
  }
  if (isValid === false) {
    throw new Error(labelTexts.invalid);
  }
  return;
};

const renderAfterGetRss = (params) => {
  const [ watchedformState, labelTexts ] = params;
  watchedformState.label.innerHTML = labelTexts.networkErr;
  watchedformState.label.labelClassList = 'result text-dark';
  return;
};

const renderAfterParse = (params) => {
  const [ watchedformState, labelTexts, inputValue ] = params;
  watchedformState.input.value = inputValue;
  if (watchedformState.links.includes(inputValue)) {
    throw new Error(labelTexts.exists);
  }
  watchedformState.links.includes(inputValue)
  watchedformState.links.push(inputValue);
  watchedformState.label.innerHTML = labelTexts.valid;
  watchedformState.label.labelClassList = 'result text-success';
  watchedformState.input.inputClassList = 'form-control mb-2';
  watchedformState.input.value = '';
  return;
}

export { renderAfterGetRss, renderErrorsBeforeParse, renderAfterParse };
