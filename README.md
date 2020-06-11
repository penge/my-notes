![My Notes](images/my-notes.png)

<br>

**My Notes** — The best way to take notes in a new tab.
Available on [**Web Store**](https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop).

<br>

## Features

- All notes quickly accessible (see [_How to open_](#how-to-open))

- All notes saved automatically

- Edited notes updated in every open window

- Can paste HTML

- Great as a [_Clipboard_](#clipboard)

- Can send text between computers (see [_Context menu_](#context-menu) or [_Google Drive Sync_](#google-drive-sync))

- Can store notes to Google Drive (see [_Google Drive Sync_](#google-drive-sync))

- Can edit notes from other computers (see [_Google Drive Sync_](#google-drive-sync))

- Works offline

<br>

## Installation

Available on [**Web Store**](https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop).

<br>

## Icon

<img src="images/icon.svg" width="48" height="48">

<br>

## How to open

There are 3 ways to open **My Notes:**

1. Click on the icon (added to the toolbar)
2. In every new tab (see [_Options_](#options))
3. Keyboard shortcut (see [_Options_](#options))

<br>

## Options

There are 3 ways to open **Options:**

1. Right click on the icon (added to the toolbar) and select Options
2. Click on Options link in the main page
3. Keyboard shortcut (see [_Options_](#options))

**Appearance:**

- Font type (Serif, Sans Serif, Monospace, Google Fonts)
- Font size
- Theme (Light, Dark, Custom)
- Enable Focus mode

**Convenience:**

- Hotkeys

**Behavior:**

- Open My Notes in every New Tab (see [_Permissions_](PERMISSIONS.md))
- Indent text on Tab (by default focuses the address bar)

**Additional functionality:**

- Enable Google Drive Sync (see [_Permissions_](PERMISSIONS.md))

<br>

## Clipboard

**Clipboard** — a note that can receive the text sent by the [_Context menu_](#context-menu).
Can be edited just like any other note as well, but cannot be renamed or deleted because of its function.

<br>

## Context menu

**Context menu** — installed with My Notes and displayed only when a text is selected to quickly Copy and Paste the text to [_Clipboard_](#clipboard).

![Context menu](images/context-menu.png)

**Save selection** — Saves the text to [_Clipboard_](#clipboard) in your current computer

**Save selection to other devices** — Saves the text to [_Clipboard_](#clipboard) in your other computer
(My Notes needs to be open, same Google Account needs to be used)

<br>

## Google Drive Sync

**Google Drive Sync** (see [_Options_](#options)) is an automatic two-way synchronization of your notes between My Notes and your Google Drive.

This gives you:

- backup (notes can be restored in future)
- can modify the notes in both sources (Google Drive, My Notes, and vice versa)
- can modify the notes from other computers (by installing My Notes and using the same Google Account)

### Location

Notes are uploaded to your Google Drive to the folder **My Notes**. This folder is created automatically.
If the folder exists from a previous installation, it is restored, notes are downloaded and uploaded, and the synchronization continues.

### Synchronization

Notes are synchronized immediately after you enable **Google Drive Sync**.
Then on every My Notes **Open/Close/Refresh**, or with the **"Sync Now"** button.
Synchronization works in both ways — to Google Drive, from Google Drive.

### Access

My Notes can only access the files it created.
It cannot see the other files in your Google Drive.

<br>

## Implementation

My Notes is implemented in **JavaScript**. The focus is on simplicity and providing an interface that just works.
It is lightweight and very fast. Zero external dependencies.
No minification or transpiling is used in the process to avoid any obfuscation.
The files you see here, are the same files you get in the extension.

**Created using:**

- JavaScript Modules (available since Chrome 61)

- ECMAScript `Proxy` (UI updates)

- Event Driven Background Script (run in background)

- `await` / `async`

**Storage:**

- `chrome.storage`
  - `chrome.storage.local` — Notes and Options (Font type, Font size, etc.), 5MB limit
  - `chrome.storage.sync` — Text sent with [_Context menu_](#context-menu), 100KB limit

- `localStorage` — Collected changes before saving (for optimized saving)

<br>

## Folder structure

```
background/
  google-drive/   # Everything related to Google Drive Sync
                    # - File operations (List, Create, Get, Update, Delete)
                    # - Synchronization (to Google Drive, from Google Drive)
                    # - Queries (find My Notes folder, list files in My Notes folder)
                    # - Multipart bodies (create My Notes folder, create file, update file)
                    # - Tests

  init/           # Run when My Notes is installed/updated
                    # - Sets a Unique ID for My Notes installation (used by Context menu), if not already set
                    # - Migrates notes and options
                    # - Creates Context menu and attaches the events
                    # - Creates a Notification when My Notes is installed/updated
                    # - Registers the ways to open My Notes (icon click, in every New Tab)
                    # - Registers events to trigger Google Drive Sync from My Notes

images/           # Images and icons used in My Notes or README

themes/           # Initialization of the custom theme for Notes and Options

notes/            # Everything related to Notes
                    # - Create/Rename/Delete notes; Note editing, Note saving
                    # - Toolbar
                    # - Every UI init and update when data changes
                    # - Registers commands (Toggle Focus mode - can be enabled in Options)

options/          # Everything related to Options
                    # - Font type, Font size, Theme, etc.
                    # - Every UI init and update when data changes

shared/           # Everything common (used at more places)
                    # - Date formatting (Last sync)
                    # - Managing the permissions (Requesting, Removing, Checking)
                    # - Helpers for Chrome Storage
                    # - Default values (Notes, Options)

tests/            # Entrypoint for tests
                    # - Runs every __tests__/index.html in the project
                    # - Prints "net::ERR_FILE_NOT_FOUND" if the test file is not found
                    # - Prints "Assertion failed: console.assert" if any assertion failed


.eslintrc         # To enforce code quality and same coding style
.gitignore        # To exclude any generated files (only .DS_Store at this point)

LICENSE           # MIT
manifest.json     # Main extension file


background.html   # Entrypoint for background script
background.js

notes.html        # Entrypoint for notes
notes.css
notes.js

options.html      # Entrypoint for options
options.css
options.js


README.md
SUPPORT.md
CONTRIBUTING.md
PERMISSIONS.md
```

<br><br><br>

[**Support**](SUPPORT.md)&nbsp;&nbsp;&nbsp;[**Contributing**](CONTRIBUTING.md)&nbsp;&nbsp;&nbsp;[**Permissions**](PERMISSIONS.md)
