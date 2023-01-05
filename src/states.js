const state = {
  form: {
    status: 'not active',
  },
  posts: [],
  links: [],
  errors: [],
  input: {
    value: '',
  },
  modal: {
    currentPost: {
      link: '',
      description: '',
      title: '',
    },
  },
};

export default state;
