<p align="center"></p>
<h1 align="center">My Notes — <a href="https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop">Web Store</a></h1>
<p align="center">
  <img src="https://badgen.net/github/release/penge/my-notes" />
  <img src="https://badgen.net/github/license/penge/my-notes" />
  <img src="https://badgen.net/chrome-web-store/users/lkeeogfaiembcblonahillacpaabmiop" />
  <br><br>
  <img src="images/my-notes.png" width="800" /><br>
  My Notes is a Chrome extension for simple and fast note-taking.<br><br>
  Write down your ideas, notes, todos, clipboard, articles, and other, all effortlessly in a Chrome's New Tab.
</p>

<br><br>

## Features

→ &nbsp; All notes available inside your Chrome ([_How to open_](#how-to-open))

→ &nbsp; All notes saved automatically

→ &nbsp; All notes synchronized in every open window as you edit them

→ &nbsp; Can use HTML

→ &nbsp; Great as a Clipboard

→ &nbsp; Can send text between computers ([_Context menu_](#context-menu))

→ &nbsp; Can store notes to Google Drive and edit them from other devices ([_Google Drive Sync_](#google-drive-sync))

→ &nbsp; Themes (Light, Dark, Custom)

→ &nbsp; Hotkeys

→ &nbsp; Works offline

<br>

## How to open

**My Notes:**

<ol type="A">
  <li>Click on My Notes icon in Chrome toolbar</li>
  <li>In every new tab (see Options)</li>
  <li>Use Hotkey (see Options)</li>
</ol>

**Options:**

<ol type="A">
  <li>Click on the gear icon in the bottom left corner</li>
  <li>Right-click on My Notes icon in the Chrome toolbar and select Options</li>
  <li>Use Hotkey (see Options)</li>
</ol>

<br><br>

## Context menu

Context menu allows you to quickly save the selected text to My Notes Clipboard (a special note in My Notes).

<img src="images/context-menu.png" width="800" />

### Save selection

Saves the selected text to My Notes Clipboard in your current computer.
My Notes doesn't have to be open.

### Save selection to other devices

Saves the selected text to My Notes Clipboard in your other computer(s).
My Notes needs to be open in the second computer and same Google Account needs to be used.

<br><br>

## Google Drive Sync

Google Drive Sync (see Options) saves your notes to your personal Google Drive and synchronizes the changes between your local My Notes and your Google Drive every time you hit the Sync button (bottom left corner).

Benefits:

- backup of notes in your Google Drive
- notes can be restored in the future if My Notes is re-installed, by re-enabling Google Drive Sync
- notes can be edited from Google Drive if needed (or from other devices that have access to Google Drive)
- notes can be edited from other computers where My Notes is installed and Google Drive Sync is enabled (using same Google Account is needed)

### Location

Notes are uploaded to your Google Drive to the folder "My Notes". This folder is created automatically.
If the folder exists from a previous installation, notes are downloaded and uploaded and the synchronization continues.

### Synchronization

Synchronization works in both ways — to Google Drive, from Google Drive.

Notes are synchronized every time you hit the Sync button.
While the synchronization is in progress, Sync button will spin.
Sync button tooltip shows the time of the most recent synchronization.

### Access

My Notes has only access to the folder "My Notes" and only to the files it created in this folder.
It cannot see, access or modify any other files in your Google Drive.

Google Drive Sync works only if the extension is installed from Web Store.

<br><br>

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

themes/           # Light, Dark, Custom

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


.editorconfig     # To enforce same editor configuration
.eslintrc         # To enforce code quality and same coding style
.gitignore        # To exclude any generated files (only .DS_Store at this point)

LICENSE           # MIT
manifest.json     # Main extension file


background.html   # Entrypoint for background page
background.js

notes.html        # Entrypoint for notes
notes.css
notes.js

options.html      # Entrypoint for options
options.css
options.js


README.md
```

<br><br>

## Browser support

My Notes has full support in Google Chrome only. Although it may be possible to install it in other browsers, the support is not complete.

Support for other Chromium-based browsers will be added if possible.

<br><br>

## Security and Privacy

My Notes doesn't collect any personal information or data.
All your notes are stored locally in your browser.
If you use Google Drive Sync, My Notes can backup the notes to your personal Google Drive.

To provide Google Drive functionality, My Notes has an application in Google Cloud.
The sole purpose of this application is to authenticate you securely towards the Google Drive and to allow the synchronization of notes.

<br><br>

## Permissions

My Notes has the permissions listed in `manifest.json`.

**Required:**

- `"storage"` — used to save the notes and options to Chrome Storage
- `"contextMenus"` — used to create My Notes Context menu

Required permissions are shown to the user before installing the extension, and are needed at all times to provide the basic functionality.

**Optional:**

- `"tabs"` — needed for "Open My Notes in every New Tab" (see Options)
- `"identity"` — needed for "Enable Google Drive Sync" (see Options)

Optional permissions are needed only to provide additional functionality that can be enabled via a checkbox in Options.

User has the choice to either approve or deny the permissions.

`"tabs"` is a more powerful permission and browsers usually display a generic, in this case unrelated warning as `It can: Read your Browsing history`.
My Notes doesn't read your browsing history. The permission is only needed to enable "Open My Notes in every New Tab".
To read more about the warnings, see the [offical documentation](https://developer.chrome.com/extensions/permission_warnings).

<br><br>

---

<p align="center"><code>Created with ❤ in 2019.</code></p>
