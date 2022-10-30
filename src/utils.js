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

const renderForm = (inputValue, result, links) => {
  if (inputValue === '') {
    return {
      label: { text: '', className: 'result' },
      input: { value: '', className: 'form-control mb-2' },
    };
  }
  if (result === true && !links.includes(inputValue)) {
    links.push(inputValue);
    return {
      label: { text: 'RSS успешно загружен', className: 'result text-success' },
      input: { value: '', className: 'form-control mb-2' },
    };
  }
  const invalid = {
    label: { text: '', className: 'result text-danger' },
    input: { value: inputValue, className: 'form-control mb-2 is-invalid' },
  };
  if (result === true && links.includes(inputValue)) {
    invalid.label.text = 'RSS уже существует';
    return invalid;
  }
  invalid.label.text = 'Ссылка должна быть валидным URL';
  return invalid;
};

export { isValidURL, renderForm };
