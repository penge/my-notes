/* global window, history */

function push(noteName) {
  if (!noteName) {
    return;
  }

  const recentNoteName = history.state && history.state.noteName;
  if (recentNoteName === noteName) {
    return;
  }

  history.pushState({ noteName: noteName }, noteName);
}

let attached;
function onpop(activateNote) {
  if (attached) {
    return;
  }

  window.onpopstate = function(event) {
    const noteName = event.state && event.state.noteName;
    activateNote(noteName);
  };

  attached = true;
}

export default {
  push,
  onpop,
};
