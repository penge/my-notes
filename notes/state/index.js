/* global Proxy, chrome */

import history from "../history.js";

import createNote from "./create-note.js";
import renameNote from "./rename-note.js";
import deleteNote from "./delete-note.js";

import view from "../view/index.js";

const state = {
  createNote,
  renameNote,
  deleteNote,
};

let stateProxy;

const activateNote = (noteName) => {
  if (noteName in stateProxy.notes) {
    stateProxy.active = noteName;
  } else {
    stateProxy.active = null;
  }
};

const handler = {
  set: function(obj, prop, value) {
    if (prop === "font") {
      view.setFont(value);
    }
    if (prop === "size") {
      view.setSize(value);
    }
    if (prop === "notes") {
      view.setNotes(value, { activateNote, renameNote, deleteNote });
    }
    if (prop === "active") {
      if (value in state.notes) {
        view.setActive(value, state.notes[value].content, { renameNote, deleteNote });
        history.push(value);
        history.onpop(activateNote);
        view.setPage("content");
      } else {
        view.setPage("notes");
      }
      chrome.storage.local.set({ active: value });
    }
    if (prop === "notification") {
      view.showNotification(value);
    }
    if (prop === "focus") {
      view.setFocus(value);
    }
    if (prop === "theme") {
      view.setTheme(value);
    }
    if (prop === "sync") {
      view.setSync(value);
    }

    obj[prop] = value;
    return true;
  }
};

stateProxy = new Proxy(state, handler);

export default stateProxy;
