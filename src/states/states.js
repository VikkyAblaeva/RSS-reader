const formState = {
  input: {
    value: '',
    inputClassList: '',
  },
  label: {
    innerHTML: '',
    labelClassList: '',
  },
  links: [],
  errors: [],
};

const modalWindowState = {
  modal: {
    style: {
      display: '',
    },
    currentPost: {
      link: '',
      description: '',
      title: '',
    },
  },
};

const postsState = {
  currentPost: {
    link: '',
    description: '',
    title: '',
  },
  posts: [],
};

export { formState, modalWindowState, postsState };
