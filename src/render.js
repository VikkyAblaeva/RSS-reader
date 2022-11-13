const renderFormBeforeParse = (params) => {
  const [ watchedformState, isValid, inputValue, labelTexts ] = params;
  if (inputValue === '') {
    //watchedformState.label.innerHTML = labelTexts.empty;
    //watchedformState.label.labelClassList = 'result text-dark';
    throw new Error('Should not be empty');
  }
  if (isValid === false) {
    //watchedformState.label.innerHTML = labelTexts.invalid;
    //watchedformState.label.labelClassList = 'result text-danger';
    //watchedformState.input.inputClassList = 'form-control mb-2 is-invalid';
    throw new Error('URL is invalid');;
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
  if (watchedformState.links.includes(inputValue)) {
    //watchedformState.label.innerHTML = labelTexts.exists;
    //watchedformState.label.labelClassList = 'result text-danger';
    //watchedformState.input.inputClassList = 'form-control mb-2 is-invalid';
    throw new Error('Already exists!');
  }
  if (!watchedformState.links.includes(inputValue)) {
    watchedformState.links.push(inputValue);
    watchedformState.label.innerHTML = labelTexts.valid;
    watchedformState.label.labelClassList = 'result text-success';
    watchedformState.input.inputClassList = 'form-control mb-2';
    watchedformState.input.value = '';
    return;
   }
    watchedformState.label.innerHTML = labelTexts.noRSS;
    watchedformState.label.labelClassList = 'result text-danger';
    watchedformState.input.inputClassList = 'form-control mb-2 is-invalid';
  return;
}

export { renderAfterGetRss, renderFormBeforeParse, renderAfterParse };
