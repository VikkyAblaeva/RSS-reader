import * as yup from 'yup';

const isValidURL = (url) => {
    let schema = yup.object().shape({
      website: yup.string().url(),
      });
      return schema
        .validate({
          website: url,
        })
        .then((valid) => true)
        .catch((err) => false);
  };

export default isValidURL;
