import { GoogleFont, NotesObject, Notification, RegularFont, Sync, Theme } from "shared/storage/schema";
import { defaultValuesFactory } from "shared/storage/default-values";

import { SetSidebarOptions } from "notes/view/set-sidebar";
import { SetToolbarOptions } from "notes/view/set-toolbar";
import { SetThemeOptions } from "themes/set-theme";

import createNote from "./create-note";
import renameNote from "./rename-note";
import deleteNote from "./delete-note";

import view from "../view/index";

import notesHistory from "../history";

interface Actions {
  createNote: (rawName: string) => void
  renameNote: (rawOldName: string, rawNewName: string) => void
  deleteNote: (noteNameToDelete: string) => void; activateNote: (noteName: string) => void
}

export type State = {
  // Notifications
  notification?: Notification

  // Appearance
  font: RegularFont | GoogleFont
  size: number
  sidebar: {
    show: boolean
    width?: number
  }
  toolbar: {
    show: boolean
  }
  theme: {
    name: Theme
    customTheme?: string
  }

  // Notes
  notes: NotesObject
  active: string | null

  // Options
  focus: boolean
  newtab: boolean
  tab: boolean

  // Sync
  sync?: Sync // Google Drive Sync
} & Actions;

const activateNote = (noteName: string) => {
  if (stateProxy.active === noteName) {
    return;
  }

  if (stateProxy.notes && noteName in stateProxy.notes) {
    stateProxy.active = noteName;
    notesHistory.push(noteName);
  } else {
    stateProxy.active = null;
  }
};

const defaults = defaultValuesFactory();

const state: State = {
  notification: undefined,
  font: defaults.font,
  size: defaults.size,
  sidebar: {
    show: defaults.sidebar,
    width: defaults.sidebarWidth,
  },
  toolbar: {
    show: defaults.toolbar,
  },
  theme: {
    name: defaults.theme,
    customTheme: defaults.customTheme,
  },
  notes: {},
  active: null,
  focus: defaults.focus,
  newtab: defaults.newtab,
  tab: defaults.tab,

  createNote,
  renameNote,
  deleteNote,
  activateNote,
};

const handler: ProxyHandler<State> = {
  set: function<K extends keyof State>(obj: State, prop: K, value: State[K]): boolean {
    // Notifications
    if (prop === "notification") {
      view.showNotification(value as Notification);
    }

    // Appearance
    if (prop === "font") {
      view.setFont(value as GoogleFont | RegularFont);
    }
    if (prop === "size") {
      view.setSize(value as number);
    }
    if (prop === "focus") {
      view.setFocus(value as boolean);
    }
    if (prop === "sidebar") {
      view.setSidebar(value as SetSidebarOptions);
    }
    if (prop === "toolbar") {
      view.setToolbar(value as SetToolbarOptions);
    }
    if (prop === "theme") {
      view.setTheme(value as SetThemeOptions);
    }

    // Notes
    if (prop === "notes") {
      view.setNotes(value as string, { activeNote: stateProxy.active || "", activateNote });
    }
    if (prop === "active") {
      if (state.notes && (value as string in state.notes)) {
        view.setActive(value as string, state.notes[value as string].content);
      }
      chrome.storage.local.set({ active: value });
    }

    // Sync
    if (prop === "sync") {
      view.setSync(value as Sync);
    }

    obj[prop] = value;
    return true;
  }
};

const stateProxy = new Proxy<State>(state, handler);

export default stateProxy;
