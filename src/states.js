const state = {
  form: {
    status: 'pending',
    label: {
      text: '',
    },
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
