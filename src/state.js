const state = {
  form: {
    status: 'pending',
    label: {
      text: '',
    },
  },
  posts: [],
  seenPosts: [],
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
