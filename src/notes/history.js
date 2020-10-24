/* global window */

// Use replace when a note is renamed or deleted
const replace = (noteName) =>
  window.history.replaceState({ noteName }, noteName, `?${noteName}`);

// Use push when a note is created
const push = (noteName) =>
  window.history.pushState({ noteName }, noteName, `?${noteName}`);

let attached = false;
const attach = (state) => {
  if (attached) {
    return;
  }

  window.onpopstate = (e) => {
    const noteName = e.state && e.state.noteName;
    if (noteName && noteName in state.notes) {
      state.active = noteName;
    }
  };

  attached = true;
};

export default {
  replace,
  push,

  attach,
};
