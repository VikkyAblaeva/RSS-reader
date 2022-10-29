import * as yup from 'yup';

const isValidURL = (url) => {
  const schema = yup.object().shape({
    website: yup.string().url(),
  });
  return schema
    .validate({
      website: url,
    })
    .then(() => true)
    .catch(() => false);
};

const renderLabel = (inputValue, result, links) => {
  const valid = {
    label: { innerHTML: 'RSS успешно загружен', addClass: 'text-success', removeClass: 'text-danger' },
    input: { removeClass: 'is-invalid', addClass: 'is-valid', value: '' },
  };
  const invalid = {
    label: { innerHTML: '', addClass: 'text-danger', removeClass: 'text-success' },
    input: { removeClass: 'is-valid', addClass: 'is-invalid', value: inputValue },
  };
  if (result === true && links.includes(inputValue)) {
    invalid.label.innerHTML = 'RSS уже существует';
    return invalid;
  }
  if (result === true && !links.includes(inputValue)) {
    links.push(inputValue);
    return valid;
  }
  invalid.label.innerHTML = 'Ссылка должна быть валидным URL';
  return invalid;
};

export { isValidURL, renderLabel };
