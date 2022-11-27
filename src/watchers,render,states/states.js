const formState = {
  input: {
    value: '',
    inputClassList: '',
  },
  label: {
    innerHTML: '',
    labelClassList: '',
  },
  button: {
    active: '',
    disabled: '',
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
  posts: [],
};

const spinnerState = {
  spinner: {
    classList: '',
  },
  wrapper: {
    classList: '',
  },
};

export {
  formState, modalWindowState,
  postsState, spinnerState,
};
