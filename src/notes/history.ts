import { State } from "./state/index";

// Use replace when a note is renamed or deleted
const replace = (noteName: string): void =>
  window.history.replaceState({ noteName }, noteName, `?${noteName}`);

// Use push when a note is created
const push = (noteName: string): void =>
  window.history.pushState({ noteName }, noteName, `?${noteName}`);

let attached = false;
const attach = (state: State): void => {
  if (attached) {
    return;
  }

  window.onpopstate = (event: PopStateEvent) => {
    const noteName = event.state && event.state.noteName;
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
