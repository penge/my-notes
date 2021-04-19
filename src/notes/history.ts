// Use replace when a note is renamed or deleted
const replace = (noteName: string): void =>
  window.history.replaceState({ noteName }, noteName, `?note=${noteName}`);

// Use push when a note is created
const push = (noteName: string): void =>
  window.history.pushState({ noteName }, noteName, `?note=${noteName}`);

let attached = false;
const attach = (onPop: (noteName: string) => void): void => {
  if (attached) {
    return;
  }

  window.onpopstate = (event: PopStateEvent) => {
    const noteName = event.state && event.state.noteName;
    if (noteName) {
      onPop(noteName);
    }
  };

  attached = true;
};

export default {
  replace,
  push,

  attach,
};
