/* global Proxy, chrome */

import createNote from "./create-note.js";
import renameNote from "./rename-note.js";
import deleteNote from "./delete-note.js";

import view from "../view/index.js";

import notesHistory from "../history.js";

let stateProxy;

const activateNote = (noteName) => {
  if (stateProxy.active === noteName) {
    return;
  }

  if (noteName in stateProxy.notes) {
    stateProxy.active = noteName;
    notesHistory.push(noteName);
  } else {
    stateProxy.active = null;
  }
};

const state = {
  createNote,
  renameNote,
  deleteNote,
  activateNote,

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
    // Notifications
    if (prop === "notification") {
      view.showNotification(value);
    }

    // Appearance
    if (prop === "font") {
      view.setFont(value);
    }
    if (prop === "size") {
      view.setSize(value);
    }
    if (prop === "focus") {
      view.setFocus(value);
    }
    if (prop === "sidebar") {
      view.setSidebar(value);
    }
    if (prop === "toolbar") {
      view.setToolbar(value);
    }
    if (prop === "theme") {
      view.setTheme(value.name, value.customTheme);
    }

    // Notes
    if (prop === "notes") {
      view.setNotes(value, { activeNote: stateProxy.active, activateNote });
    }
    if (prop === "active") {
      if (value in state.notes) {
        view.setActive(value, state.notes[value].content);
      }
      chrome.storage.local.set({ active: value });
    }

    // Sync
    if (prop === "sync") {
      view.setSync(value);
    }

    obj[prop] = value;
    return true;
  }
};

stateProxy = new Proxy(state, handler);

export default stateProxy;
