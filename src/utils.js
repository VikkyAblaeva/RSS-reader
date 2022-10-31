import * as yup from 'yup';

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

export { isValidURL };
