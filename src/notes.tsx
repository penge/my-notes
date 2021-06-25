import { h, render, Fragment } from "preact";
import { useState, useEffect, useRef, useCallback, useMemo } from "preact/hooks";

import {
  Os,
  Storage,
  Notification,
  RegularFont,
  GoogleFont,
  Theme,
  NotesObject,
  Sync,
  Message,
  MessageType,
} from "shared/storage/schema";
import { setTheme as setThemeCore } from "themes/set-theme";

import __Notification from "notes/components/Notification";
import __Sidebar from "notes/components/Sidebar";
import __Content from "notes/components/Content";
import __CommandPalette, { CommandPaletteProps } from "notes/components/CommandPalette";
import __Toolbar from "notes/components/Toolbar";
import range from "notes/range";

import __ContextMenu, { ContextMenuProps } from "notes/components/ContextMenu";
import __RenameNoteModal, { RenameNoteModalProps } from "notes/components/modals/RenameNoteModal";
import __DeleteNoteModal, { DeleteNoteModalProps } from "notes/components/modals/DeleteNoteModal";
import __NewNoteModal, { NewNoteModalProps } from "notes/components/modals/NewNoteModal";
import __Overlay from "notes/components/Overlay";

import renameNote from "notes/state/rename-note";
import deleteNote from "notes/state/delete-note";
import createNote from "notes/state/create-note";

import { saveNote, setLocked } from "notes/content/save";
import { sendMessage } from "messages";

import notesHistory from "notes/history";
import keyboardShortcuts, { KeyboardShortcut } from "notes/keyboard-shortcuts";
import { Command, commands } from "notes/commands";

const getFocusOverride = (): boolean => new URL(window.location.href).searchParams.get("focus") === "";
const getActiveFromUrl = (): string => new URL(window.location.href).searchParams.get("note") || ""; // Bookmark
const getFirstAvailableNote = (notes: NotesObject): string => Object.keys(notes).sort().shift() || "";

let latestOnToggleCommandPaletteCallback: () => void;
const detachOnToggleCommandPaletteCallback = () => {
  if (latestOnToggleCommandPaletteCallback) {
    keyboardShortcuts.unsubscribe(latestOnToggleCommandPaletteCallback);
  }
};
const reatachOnToggleCommandPalette = (callback: () => void) => {
  detachOnToggleCommandPaletteCallback();
  latestOnToggleCommandPaletteCallback = callback;
  keyboardShortcuts.subscribe(KeyboardShortcut.OnToggleCommandPalette, latestOnToggleCommandPaletteCallback);
};

let latestOnRepeatLastExecutedCommand: () => void;
const detachOnRepeatLastExecutedCommandCallback = () => {
  if (latestOnRepeatLastExecutedCommand) {
    keyboardShortcuts.unsubscribe(latestOnRepeatLastExecutedCommand);
  }
};
const reatachOnExecuteLastCommand = (callback: () => void) => {
  detachOnRepeatLastExecutedCommandCallback();
  latestOnRepeatLastExecutedCommand = callback;
  keyboardShortcuts.subscribe(KeyboardShortcut.OnRepeatLastExecutedCommand, latestOnRepeatLastExecutedCommand);
};

interface NotesProps {
  notes: NotesObject
  active: string
}

const Notes = (): h.JSX.Element => {
  const [os, setOs] = useState<Os | undefined>(undefined);
  const [tabId, setTabId] = useState<string>("");

  const [notification, setNotification] = useState<Notification | undefined>(undefined);
  const [font, setFont] = useState<RegularFont | GoogleFont | undefined>(undefined);
  const [size, setSize] = useState<number>(0);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<string | undefined>(undefined);
  const [toolbar, setToolbar] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [customTheme, setCustomTheme] = useState<string>("");

  const [notesProps, setNotesProps] = useState<NotesProps>({
    notes: {},
    active: "",
  });
  const notesRef = useRef<NotesObject>();
  notesRef.current = notesProps.notes;

  const [initialContent, setInitialContent] = useState<string>("");
  const [focus, setFocus] = useState<boolean>(false);
  const [tab, setTab] = useState<boolean>(false);
  const [tabSize, setTabSize] = useState<number>(-1);
  const [sync, setSync] = useState<Sync | undefined>(undefined);
  const syncRef = useRef<Sync | undefined>(undefined);
  syncRef.current = sync;

  const [initialized, setInitialized] = useState<boolean>(false);
  const [initialAutoSync, setInitialAutoSync] = useState<boolean>(false);

  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps | null>(null);
  const [renameNoteModalProps, setRenameNoteModalProps] = useState<RenameNoteModalProps | null>(null);
  const [deleteNoteModalProps, setDeleteNoteModalProps] = useState<DeleteNoteModalProps | null>(null);
  const [newNoteModalProps, setNewNoteModalProps] = useState<NewNoteModalProps | null>(null);
  const [commandPaletteProps, setCommandPaletteProps] = useState<CommandPaletteProps | null>(null);

  useEffect(() => {
    chrome.runtime.getPlatformInfo((platformInfo) => setOs(platformInfo.os === "mac" ? "mac" : "other"));
    chrome.tabs.getCurrent((tab) => tab && setTabId(String(tab.id)));
  }, []);

  useEffect(() => {
    if (!tabId) {
      return;
    }

    chrome.storage.local.get([
      // Notifications
      "notification",

      // Appearance
      "font",
      "size",
      "sidebar",
      "sidebarWidth",
      "toolbar",
      "theme",
      "customTheme",

      // Notes
      "notes",
      "active",

      // Options
      "focus",
      "autoSync",
      "tab",
      "tabSize",

      // Sync
      "sync",
    ], items => {
      const local = items as Storage;

      // Notifications
      setNotification(local.notification);

      // Appearance
      setFont(local.font);
      setSize(local.size);
      setSidebar(local.sidebar);
      setSidebarWidth(local.sidebarWidth);
      setToolbar(local.toolbar);
      setTheme(local.theme);
      setCustomTheme(local.customTheme);

      // Notes
      const activeFromUrl = getActiveFromUrl();
      const activeCandidates: string[] = [activeFromUrl, local.active as string, getFirstAvailableNote(local.notes)]; // ordered by importance
      const active: string = activeCandidates.find((candidate) => candidate && candidate in local.notes) || "";
      setNotesProps({
        notes: local.notes,
        active,
      });
      if (active !== activeFromUrl) {
        notesHistory.replace(active);
      }

      // Options
      setFocus(getFocusOverride() || local.focus);
      setInitialAutoSync(Boolean(local.sync) && local.autoSync);
      setTab(local.tab);
      setTabSize(local.tabSize);

      // Sync
      setSync(local.sync);

      setInitialized(true);
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") {
        return;
      }

      if (changes["font"]) {
        setFont(changes["font"].newValue);
      }

      if (changes["size"]) {
        setSize(changes["size"].newValue);
      }

      if (changes["theme"]) {
        setTheme(changes["theme"].newValue);
      }

      if (changes["customTheme"]) {
        setCustomTheme(changes["customTheme"].newValue);
      }

      if (changes["notes"]) {
        const oldNotes: NotesObject = changes["notes"].oldValue;
        const newNotes: NotesObject = changes["notes"].newValue;

        const oldSet = new Set(Object.keys(oldNotes));
        const newSet = new Set(Object.keys(newNotes));

        // RENAME
        if (newSet.size === oldSet.size) {
          const diff = new Set([...newSet].filter(x => !oldSet.has(x)));
          if (diff.size === 1) {
            const renamedNoteName = diff.values().next().value as string;
            setNotesProps((prev) => {
              const newActive = prev.active in newNotes
                ? prev.active // active is NOT renamed => keep unchanged
                : renamedNoteName; // active is renamed => update it

              if (newActive !== prev.active) {
                notesHistory.replace(newActive); // active is renamed => replace history
              }

              return {
                notes: newNotes,
                active: newActive,
              };
            });

            return; // RENAME condition was met
          }
        }

        // DELETE
        if (oldSet.size > newSet.size) {
          setNotesProps((prev) => {
            const newActive = prev.active in newNotes
              ? prev.active // active is NOT deleted => keep unchanged
              : getFirstAvailableNote(newNotes); // active is deleted => use first available

            if (newActive !== prev.active) {
              notesHistory.replace(newActive); // active is deleted => replace history
            }

            return {
              notes: newNotes,
              active: newActive,
            };
          });

          return; // DELETE condition was met
        }

        // NEW or UPDATE
        setNotesProps((prev) => {
          const diff = newSet.size > oldSet.size
            ? new Set([...newSet].filter(x => !oldSet.has(x)))
            : undefined;

          const newNoteName = (changes["active"] && changes["active"].newValue as string)
            || ((diff && diff.size === 1) ? diff.values().next().value as string : "");

          // Auto-active new note
          const newActive = newNoteName || prev.active;

          // Re-activate note updated from background or from other tab
          const setBy: string = changes["setBy"] && changes["setBy"].newValue;
          if (
            (setBy && !setBy.startsWith(`${tabId}-`)) &&
            (newActive in oldNotes) &&
            (newActive in newNotes) &&
            (newNotes[newActive].content !== oldNotes[newActive].content)
          ) {
            setInitialContent(newNotes[newActive].content);
          }

          if (!(newActive in oldNotes)) {
            notesHistory.push(newActive);
          }

          return {
            notes: newNotes,
            active: newActive,
          };
        });
      }

      if (changes["focus"]) {
        setFocus(getFocusOverride() || changes["focus"].newValue);
      }

      if (changes["tab"]) {
        setTab(changes["tab"].newValue);
      }

      if (changes["tabSize"]) {
        setTabSize(changes["tabSize"].newValue);
      }

      if (changes["sync"]) {
        setSync(changes["sync"].newValue);
        document.body.classList.remove("syncing");
      }
    });

    chrome.runtime.onMessage.addListener((message: Message) => {
      if (message.type === MessageType.SYNC_START) {
        document.body.classList.add("syncing");
        return;
      }

      if (message.type === MessageType.SYNC_DONE || message.type === MessageType.SYNC_FAIL) {
        document.body.classList.remove("syncing");
        return;
      }
    });

    notesHistory.attach((noteName) => {
      setNotesProps((prev) => noteName in prev.notes
        ? { ...prev, active: noteName }
        : prev);
    });
  }, [tabId]);

  // Font
  useEffect(() => {
    if (!font) {
      return;
    }

    const href = (font as GoogleFont).href;
    if (href) {
      (document.getElementById("google-fonts") as HTMLLinkElement).href = href;
    }

    document.body.style.fontFamily = font.fontFamily;
  }, [font]);

  // Size
  useEffect(() => {
    document.body.style.fontSize = Number.isInteger(size) ? `${size}%` : "";
  }, [size]);

  // Sidebar
  useEffect(() => {
    document.body.classList.toggle("with-sidebar", sidebar);
  }, [sidebar]);

  // Sidebar width
  useEffect(() => {
    document.body.style.left = sidebarWidth ?? "";
  }, [sidebarWidth]);

  // Theme
  useEffect(() => {
    // setThemeCore injects one of:
    // - light.css
    // - dark.css
    // - customTheme string
    theme && setThemeCore(document, { theme, customTheme: customTheme });
  }, [theme, customTheme]);

  // Focus
  useEffect(() => {
    document.body.classList.toggle("focus", focus);
  }, [focus]);

  // Auto Sync on open My Notes
  useEffect(() => {
    if (!initialized || !initialAutoSync) {
      return;
    }

    sendMessage(MessageType.SYNC); // Auto Sync on open My Notes
  }, [initialized, initialAutoSync]);

  // Hide context menu on click anywhere
  useEffect(() => {
    document.addEventListener("click", (event) => {
      if ((event.target as Element).closest("#context-menu") === null) {
        setContextMenuProps(null);
      }
    });
  }, []);

  // Activate note
  useEffect(() => {
    const note = notesProps.notes[notesProps.active];
    setInitialContent(note ? note.content : "");
    document.title = note ? notesProps.active : "My Notes";
  }, [notesProps.active]);

  // Toolbar
  useEffect(() => {
    document.body.classList.toggle("with-toolbar", toolbar);
  }, [toolbar]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!os) {
      return;
    }

    keyboardShortcuts.register(os);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnEscape, () => {
      setContextMenuProps(null);
      setCommandPaletteProps(null);
    });
    keyboardShortcuts.subscribe(KeyboardShortcut.OnOpenOptions, () => chrome.tabs.create({ url: "/options.html" }));
    keyboardShortcuts.subscribe(KeyboardShortcut.OnToggleFocusMode, () => {
      if (getFocusOverride()) {
        return;
      }
      chrome.storage.local.get(["focus"], local => {
        chrome.storage.local.set({ focus: !local.focus });
      });
    });

    keyboardShortcuts.subscribe(KeyboardShortcut.OnToggleSidebar, () => {
      if (getFocusOverride()) {
        return;
      }
      chrome.storage.local.get(["focus"], local => {
        if (!local.focus) { // toggle only if not in focus mode
          const hasSidebar = document.body.classList.toggle("with-sidebar");
          chrome.storage.local.set({ sidebar: hasSidebar });
        }
      });
    });

    keyboardShortcuts.subscribe(KeyboardShortcut.OnToggleToolbar, () => {
      if (getFocusOverride()) {
        return;
      }
      chrome.storage.local.get(["focus"], local => {
        if (!local.focus) { // toggle only if not in focus mode
          const hasToolbar = document.body.classList.toggle("with-toolbar");
          chrome.storage.local.set({ toolbar: hasToolbar });
        }
      });
    });

    keyboardShortcuts.subscribe(KeyboardShortcut.OnSync, () => sendMessage(MessageType.SYNC));
  }, [os]);

  useEffect(() => {
    window.addEventListener("blur", () => {
      document.body.classList.remove("with-control");
    });
  }, []);

  const onNewNote = useCallback((empty?: boolean) => {
    setNewNoteModalProps({
      validate: (newNoteName: string) => newNoteName.length > 0 && !(newNoteName in notesProps.notes),
      onCancel: empty ? undefined : () => setNewNoteModalProps(null),
      onConfirm: (newNoteName) => {
        setNewNoteModalProps(null);
        createNote(newNoteName);
      },
    });
  }, [notesProps]);

  const handleOnActivateNote = useCallback((noteName: string) => {
    if (notesProps.active === noteName || !(noteName in notesProps.notes)) {
      return;
    }
    setNotesProps((prev) => ({ ...prev, active: noteName }));
    notesHistory.push(noteName);
    chrome.storage.local.set({ active: noteName });
  }, [notesProps]);

  // Command Palette
  const commandPaletteCommands = useMemo((): Command[] => [
    commands.InsertCurrentDate,
    commands.InsertCurrentTime,
    commands.InsertCurrentDateAndTime,
  ], []);

  const [lastExecutedCommand, setLastExecutedCommand] = useState<Command | undefined>(undefined);
  useEffect(() => {
    if (!lastExecutedCommand) {
      detachOnRepeatLastExecutedCommandCallback();
      return;
    }

    reatachOnExecuteLastCommand(lastExecutedCommand.execute);
  }, [lastExecutedCommand]);

  // Command Palette
  useEffect(() => {
    const noteNames = Object.keys(notesProps.notes);
    if (!noteNames.length) {
      detachOnToggleCommandPaletteCallback();
      setCommandPaletteProps(null);
      return;
    }

    const currentNoteLocked: boolean = notesProps.active in notesProps.notes && notesProps.notes[notesProps.active].locked === true;
    const commands = commandPaletteCommands.map((command) => command.name);

    const props: CommandPaletteProps = {
      noteNames,
      commands: currentNoteLocked ? [] : commands,
      onActivateNote: (noteName: string) => {
        setCommandPaletteProps(null);
        range.restore(() => handleOnActivateNote(noteName));
      },
      onExecuteCommand: (commandName: string) => {
        const foundCommand = commandPaletteCommands.find((command) => command.name === commandName);
        if (foundCommand) {
          setCommandPaletteProps(null);
          range.restore(() => {
            foundCommand.execute();
            setLastExecutedCommand(foundCommand);
          });
        }
      },
    };

    reatachOnToggleCommandPalette(() => {
      setCommandPaletteProps((prev) => {
        if (prev) {
          return null;
        }

        range.save();
        return props;
      });
    });

    setCommandPaletteProps((prev) => !prev ? prev : props);
  }, [os, notesProps, handleOnActivateNote, commandPaletteCommands]);

  useEffect(() => {
    if (!initialized || !tabId) {
      return;
    }

    const empty = Object.keys(notesProps.notes).length === 0;
    if (empty) {
      onNewNote(empty);
    }
  }, [initialized, tabId, notesProps, onNewNote]);

  return (
    <Fragment>
      {notification && (
        <__Notification
          notification={notification}
          onClose={() => {
            setNotification(undefined);
            chrome.storage.local.remove("notification");
          }}
        />
      )}

      <__Sidebar
        os={os}
        notes={notesProps.notes}
        active={notesProps.active}
        width={sidebarWidth}
        onActivateNote={handleOnActivateNote}
        onNoteContextMenu={(noteName, x, y) => setContextMenuProps({
          noteName, x, y,
          onRename: (noteName) => {
            setContextMenuProps(null);
            setRenameNoteModalProps({
              noteName,
              validate: (newNoteName: string) => newNoteName.length > 0 && newNoteName !== noteName && !(newNoteName in notesProps.notes),
              onCancel: () => setRenameNoteModalProps(null),
              onConfirm: (newNoteName) => {
                setRenameNoteModalProps(null);
                renameNote(noteName, newNoteName);
              },
            });
          },
          onDelete: (noteName) => {
            setContextMenuProps(null);
            setDeleteNoteModalProps({
              noteName,
              onCancel: () => setDeleteNoteModalProps(null),
              onConfirm: () => {
                setDeleteNoteModalProps(null);
                deleteNote(noteName);
              },
            });
          },
          locked: notesProps.notes[noteName].locked ?? false,
          toggleLocked: (noteName) => {
            setContextMenuProps(null);
            setLocked(noteName, !(notesProps.notes[noteName].locked ?? false), tabId, notesRef.current);
          },
        })}
        onNewNote={() => onNewNote()}
        sync={sync}
      />

      <div id="content-container">
        {notesProps.active && (
          <__Content
            active={notesProps.active}
            locked={notesProps.notes[notesProps.active].locked ?? false}
            initialContent={initialContent}
            onEdit={(active, content) => {
              saveNote(active, content, tabId, notesRef.current);
            }}
            indentOnTab={tab}
            tabSize={tabSize}
          />
        )}

        {commandPaletteProps && (
          <__CommandPalette {...commandPaletteProps} />
        )}
      </div>

      {os && notesProps.active && notesProps.active in notesProps.notes && (
        <__Toolbar
          os={os}
          note={notesProps.notes[notesProps.active]}
        />
      )}

      {contextMenuProps && (
        <__ContextMenu {...contextMenuProps} />
      )}

      {renameNoteModalProps && (
        <Fragment>
          <__RenameNoteModal {...renameNoteModalProps} />
          <__Overlay type="to-rename" />
        </Fragment>
      )}

      {deleteNoteModalProps && (
        <Fragment>
          <__DeleteNoteModal {...deleteNoteModalProps} />
          <__Overlay type="to-delete" />
        </Fragment>
      )}

      {newNoteModalProps && (
        <Fragment>
          <__NewNoteModal {...newNoteModalProps} />
          <__Overlay type="to-create" />
        </Fragment>
      )}

      <div id="tooltip-container"></div>
    </Fragment>
  );
};

render(<Notes />, document.body);
