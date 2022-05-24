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
  NotesOrder,
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

import createNote from "notes/state/create-note";
import renameNote from "notes/state/rename-note";
import deleteNote from "notes/state/delete-note";
import duplicateNote from "notes/state/duplicate-note";

import { saveNote, setLocked, setPinnedTime } from "notes/content/save";
import { sendMessage } from "messages";

import { getActiveFromUrl, getFocusOverride } from "notes/location";
import { getFirstAvailableNoteName } from "notes/filters";
import notesHistory from "notes/history";
import keyboardShortcuts, { KeyboardShortcut } from "notes/keyboard-shortcuts";
import { useKeyboardShortcut } from "notes/hooks/use-keyboard-shortcut";
import { Command, commands, toggleSidebar, toggleToolbar } from "notes/commands";
import { exportNote } from "notes/export";
import { notesToSidebarNotes } from "notes/adapters";
import { t } from "i18n";

let autoSyncIntervalId: number | undefined;

interface NotesProps {
  notes: NotesObject
  active: string
}

const Notes = (): h.JSX.Element => {
  const [os, setOs] = useState<Os | undefined>(undefined);
  const [tabId, setTabId] = useState<number | undefined>(undefined);

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
  const [order, setOrder] = useState<string[] | undefined>(undefined);

  const [initialContent, setInitialContent] = useState<string>("");
  const [notesOrder, setNotesOrder] = useState<NotesOrder | undefined>(undefined);
  const [focus, setFocus] = useState<boolean>(false);
  const [tab, setTab] = useState<boolean>(false);
  const [tabSize, setTabSize] = useState<number>(-1);
  const [openNoteOnMouseHover, setOpenNoteOnMouseHover] = useState<boolean>(false);
  const [sync, setSync] = useState<Sync | undefined>(undefined);
  const syncRef = useRef<Sync | undefined>(undefined);
  syncRef.current = sync;
  const [autoSync, setAutoSync] = useState<boolean>(false);
  const lastEditRef = useRef<string>("");

  const [initialized, setInitialized] = useState<boolean>(false);

  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps | null>(null);
  const [renameNoteModalProps, setRenameNoteModalProps] = useState<RenameNoteModalProps | null>(null);
  const [deleteNoteModalProps, setDeleteNoteModalProps] = useState<DeleteNoteModalProps | null>(null);
  const [newNoteModalProps, setNewNoteModalProps] = useState<NewNoteModalProps | null>(null);
  const [commandPaletteProps, setCommandPaletteProps] = useState<CommandPaletteProps | null>(null);

  useEffect(() => {
    chrome.runtime.getPlatformInfo((platformInfo) => setOs(platformInfo.os === "mac" ? "mac" : "other"));
    chrome.tabs.getCurrent((tab) => tab && setTabId(tab.id));
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
      "order",
      "active",

      // Options
      "notesOrder",
      "focus",
      "autoSync",
      "tab",
      "tabSize",
      "openNoteOnMouseHover",

      // Sync
      "sync",
      "autoSync",
      "lastEdit",
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
      const activeCandidates: string[] = [activeFromUrl, local.active as string, getFirstAvailableNoteName(local.notes)]; // ordered by importance
      const active: string = activeCandidates.find((candidate) => candidate && candidate in local.notes) || "";
      setNotesProps({
        notes: local.notes,
        active,
      });
      if (active !== activeFromUrl) {
        notesHistory.replace(active);
      }
      setOrder(local.order);

      // Options
      setNotesOrder(local.notesOrder);
      setFocus(getFocusOverride() || local.focus);
      setTab(local.tab);
      setTabSize(local.tabSize);
      setOpenNoteOnMouseHover(local.openNoteOnMouseHover);

      // Sync
      setSync(local.sync);
      setAutoSync(local.autoSync);
      lastEditRef.current = local.lastEdit;

      // Initialized
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
              : getFirstAvailableNoteName(newNotes); // active is deleted => use first available

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

          // Update note content if updated from background
          const setBy: string | undefined = changes["setBy"] && changes["setBy"].newValue;
          if (
            (setBy && !setBy.startsWith(`${tabId}-`)) && // expecting "worker-*" or "sync-*"
            (newActive in oldNotes) &&
            (newActive in newNotes) &&
            (newNotes[newActive].content !== oldNotes[newActive].content) &&
            (newNotes[newActive].modifiedTime > oldNotes[newActive].modifiedTime)
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

      if (changes["order"]) {
        setOrder(changes["order"].newValue);
      }

      if (changes["notesOrder"]) {
        setNotesOrder(changes["notesOrder"].newValue);
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

      if (changes["openNoteOnMouseHover"]) {
        setOpenNoteOnMouseHover(changes["openNoteOnMouseHover"].newValue);
      }

      if (changes["sync"]) {
        setSync(changes["sync"].newValue);
        document.body.classList.remove("syncing");
      }

      if (changes["autoSync"]) {
        setAutoSync(changes["autoSync"].newValue);
      }

      if (changes["lastEdit"]) {
        lastEditRef.current = changes["lastEdit"].newValue;
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
      setCommandPaletteProps((prev) => {
        if (prev) {
          range.restore();
        }

        return null;
      });
    });
    keyboardShortcuts.subscribe(KeyboardShortcut.OnOpenOptions, chrome.runtime.openOptionsPage);
    keyboardShortcuts.subscribe(KeyboardShortcut.OnToggleFocusMode, () => {
      if (getFocusOverride()) {
        return;
      }
      chrome.storage.local.get(["focus"], local => {
        chrome.storage.local.set({ focus: !local.focus });
      });
    });

    keyboardShortcuts.subscribe(KeyboardShortcut.OnToggleSidebar, toggleSidebar);

    keyboardShortcuts.subscribe(KeyboardShortcut.OnToggleToolbar, toggleToolbar);

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

  const [setOnNewNoteHandler] = useKeyboardShortcut(KeyboardShortcut.OnNewNote);
  useEffect(() => setOnNewNoteHandler(newNoteModalProps ? undefined : onNewNote), [onNewNote, newNoteModalProps]);

  const handleOnActivateNote = useCallback((noteName: string) => {
    if (notesProps.active === noteName || !(noteName in notesProps.notes)) {
      return;
    }
    setNotesProps((prev) => ({ ...prev, active: noteName }));
    notesHistory.push(noteName);
    chrome.storage.local.set({ active: noteName });
  }, [notesProps]);

  // Command Palette
  const commandPaletteCommands: { name: string, translation: h.JSX.Element, command: Command }[] = useMemo(() => [
    {
      name: "Insert current Date",
      translation: t("Insert current Date"),
      command: commands.InsertCurrentDate,
    },
    {
      name: "Insert current Time",
      translation: t("Insert current Time"),
      command: commands.InsertCurrentTime,
    },
    {
      name: "Insert current Date and Time",
      translation: t("Insert current Date and Time"),
      command: commands.InsertCurrentDateAndTime,
    },
    {
      name: "Toggle Sidebar",
      translation: t("Shortcuts descriptions.Toggle Sidebar"),
      command: toggleSidebar,
    },
    {
      name: "Toggle Toolbar",
      translation: t("Shortcuts descriptions.Toggle Toolbar"),
      command: toggleToolbar,
    },
  ], []);

  // Repeat last executed command
  const [setOnRepeatLastExecutedCommandHandler] = useKeyboardShortcut(KeyboardShortcut.OnRepeatLastExecutedCommand);

  // Command Palette
  const [setOnToggleCommandPaletteHandler] = useKeyboardShortcut(KeyboardShortcut.OnToggleCommandPalette);
  useEffect(() => {
    if (!notesOrder) {
      return;
    }

    // Detach when there are no notes
    if (!Object.keys(notesProps.notes).length) {
      setOnToggleCommandPaletteHandler(undefined);
      setCommandPaletteProps(null);
      return;
    }

    // Start preparing props for Command Palette
    const currentNoteLocked: boolean = notesProps.active in notesProps.notes && notesProps.notes[notesProps.active].locked === true;
    const commands = currentNoteLocked ? [] : commandPaletteCommands;

    // Props for Command Palette
    const props: CommandPaletteProps = {
      notes: notesToSidebarNotes(notesProps.notes, notesOrder, order),
      commands,
      onActivateNote: (noteName: string) => {
        setCommandPaletteProps(null);
        range.restore(() => handleOnActivateNote(noteName));
      },
      onExecuteCommand: (commandName: string) => {
        const foundCommand = commandPaletteCommands.find((command) => command.name === commandName);
        if (foundCommand) {
          setCommandPaletteProps(null);
          range.restore(() => {
            foundCommand.command();
            setOnRepeatLastExecutedCommandHandler(foundCommand.command);
          });
        }
      },
    };

    // Update event to show Command Palette and props to use
    setOnToggleCommandPaletteHandler(() => {
      setCommandPaletteProps((prev) => {
        if (prev) {
          range.restore();
          return null;
        }

        range.save();
        return props;
      });
    });

    // Update props for already visible Command Palette
    setCommandPaletteProps((prev) => !prev ? prev : props);
  }, [os, notesProps, notesOrder, order, handleOnActivateNote, commandPaletteCommands]);

  // Automatically show modal to create a new note if there are 0 notes
  useEffect(() => {
    if (initialized && typeof tabId === "number" && Object.keys(notesProps.notes).length === 0) {
      onNewNote(true);
    }
  }, [initialized, tabId, notesProps, onNewNote]);

  // Auto Sync
  useEffect(() => {
    if (!initialized || !autoSync || !syncRef.current) {
      window.clearInterval(autoSyncIntervalId);
      autoSyncIntervalId = undefined;
      return;
    }

    if (autoSyncIntervalId) {
      return; // interval is already set
    }

    window.setTimeout(() => sendMessage(MessageType.SYNC), 100); // Auto Sync on start
    autoSyncIntervalId = window.setInterval(() => {
      if (!syncRef.current || lastEditRef.current <= (syncRef.current.lastSync ?? "")) {
        return;
      }

      sendMessage(MessageType.SYNC);
    }, 6000); // and then Auto Sync every 6 seconds
  }, [initialized, autoSync]);

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

      {notesOrder && order && (
        <__Sidebar
          os={os}
          notes={notesToSidebarNotes(notesProps.notes, notesOrder, order)}
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
            onToggleLocked: (noteName) => {
              setContextMenuProps(null);
              tabId && notesRef.current && setLocked(noteName, !(notesProps.notes[noteName].locked ?? false), tabId, notesRef.current);
            },
            pinned: !!notesProps.notes[noteName].pinnedTime,
            onTogglePinnedTime: (noteName) => {
              setContextMenuProps(null);
              tabId && notesRef.current && setPinnedTime(noteName, (notesProps.notes[noteName].pinnedTime ?? undefined) ? undefined : new Date().toISOString(), tabId, notesRef.current);
            },
            onDuplicate: (noteName) => {
              setContextMenuProps(null);
              duplicateNote(noteName);
            },
            onExport: (noteName) => {
              setContextMenuProps(null);
              exportNote(noteName);
            },
          })}
          onNewNote={() => onNewNote()}
          canChangeOrder={notesOrder === NotesOrder.Custom}
          onChangeOrder={(newOrder) => chrome.storage.local.set({ order: newOrder })}
          sync={sync}
          openNoteOnMouseHover={openNoteOnMouseHover}
        />
      )}

      <div id="content-container">
        {notesProps.active && (
          <__Content
            active={notesProps.active}
            locked={notesProps.notes[notesProps.active].locked ?? false}
            initialContent={initialContent}
            onEdit={(active, content) => {
              tabId && notesRef.current && saveNote(active, content, tabId, notesRef.current);
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
