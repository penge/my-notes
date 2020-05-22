/* global Proxy, chrome */

import createNote from "./create-note.js";
import renameNote from "./rename-note.js";
import deleteNote from "./delete-note.js";

import view from "../view/index.js";

let stateProxy;

const activateNote = (noteName) => {
  if (noteName in stateProxy.notes) {
    stateProxy.active = noteName;
  } else {
    stateProxy.active = null;
  }
};

const state = {
  createNote,
  renameNote,
  deleteNote,

  previousNote: () => {
    const notes = Object.keys(stateProxy.notes);
    const currentIndex = notes.indexOf(stateProxy.active);
    if (currentIndex === -1) {
      return;
    }
    const newIndex = currentIndex === 0 ? (notes.length - 1) : currentIndex - 1;
    activateNote(notes[newIndex]);
  },

  nextNote: () => {
    const notes = Object.keys(stateProxy.notes);
    const currentIndex = notes.indexOf(stateProxy.active);
    if (currentIndex === -1) {
      return;
    }
    const newIndex = currentIndex === (notes.length - 1) ? 0 : currentIndex + 1;
    activateNote(notes[newIndex]);
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
