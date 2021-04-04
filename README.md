<p align="center"></p>
<h1 align="center">My Notes — <a href="https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop">Web Store</a></h1>
<p align="center">
  <img src="https://badgen.net/github/release/penge/my-notes" />
  <img src="https://badgen.net/github/license/penge/my-notes" />
  <img src="https://badgen.net/chrome-web-store/users/lkeeogfaiembcblonahillacpaabmiop" />
  <br><br>
  <img src="static/images/my-notes.png" width="800" /><br>
  My Notes is a Chrome extension for simple and fast note-taking.<br><br>
  Write down your ideas, notes, todos, and other – all effortlessly while staying in Chrome.
</p>

<br><br>

## Features

→ &nbsp; All notes quickly accessible in Chrome ([_How to open_](#how-to-open))

→ &nbsp; All notes automatically saved and synchronized in every open tab

→ &nbsp; Context menu to save selected text from websites, or transfer selected text to other computer ([_Context menu_](#context-menu))

→ &nbsp; Backup notes to Google Drive or edit them from other devices ([_Google Drive Sync_](#google-drive-sync))

→ &nbsp; Themes (Light, Dark, Custom)

→ &nbsp; Keyboard shortcuts

→ &nbsp; Works offline

<br>

## How to open

**My Notes:**

<ol type="A">
  <li>Click on My Notes icon in Chrome toolbar (pin the icon for quick access)</li>
  <li>Use keyboard shortcut (see <code>chrome://extensions/shortcuts</code>)</li>
</ol>

**Options:**

<ol type="A">
  <li>Click on gear icon in bottom left corner</li>
  <li>Click on three-dots icon next to My Notes in Chrome toolbar and select Options</li>
  <li>Use keyboard shortcut (see Options)</li>
</ol>

<br><br>

## Context menu

Context menu allows you to quickly save selected text from any website to My Notes, or to transfer selected text to My Notes in other computer.

To use Context menu, select the text on website, right-click and see "My Notes" Context menu.

Context menu has these options:

- `Save to [note name]` – Option for every note. As you create new notes, they are automatically added to the list. My Notes doesn't have to be open. Google Drive Sync is not required.
- `Save to remotely open My Notes` – My Notes in other computer needs to be open. Same Google Account needs to be used. Google Drive Sync is not required. The destination note to save the text will be named **"@Received"** (created automatically if doesn't exist, otherwise updated).

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
env/              # Helpers for environment variables

out/              # Bundled My Notes (excluded from Git)

src/
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
                      # - Registers the ways to open My Notes (icon click, keyboard shortcut)
                      # - Registers events to trigger Google Drive Sync from My Notes

  dom/              # Helpers to get DOM elements

  integration/      # Integration tests for Google Drive Sync

  messages/         # Communication between My Notes and background script

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

  themes/           # Light, Dark, Custom

  background.ts     # Main script for background page
  notes.ts          # Main script for notes
  options.ts        # Main script for options

static/           # All static files (images, icons, HTML, CSS) copied to out/


.editorconfig     # To enforce same editor configuration
.eslintrc         # To enforce code quality and same coding style with ESLint
.eslintignore     # Files excluded from ESLint checking
.gitignore        # Files excluded from Git

jest.config.js    # Jest configuration
tsconfig.json     # Typescript configuration

package-lock.json
package.json

LICENSE           # MIT
manifest.json     # Main extension file

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
The sole purpose of this application is to authenticate you securely towards Google Drive and to allow the synchronization of notes.

<br><br>

## Permissions

My Notes has the permissions listed in `manifest.json`.

**Required:**

- `"storage"` — used to save the notes and options to Chrome Storage
- `"contextMenus"` — used to create My Notes Context menu

Required permissions are shown to the user before installing the extension, and are needed at all times to provide the basic functionality.

**Optional:**

- `"identity"` — needed for "Enable Google Drive Sync" (see Options)

Optional permissions are needed only to provide additional functionality that can be enabled via a checkbox in Options.

User has the choice to either approve or deny the permissions.

<br><br>

## QA

**1. Where is My Notes published? What is the process behind publishing My Notes?**

My Notes is published to [Web Store](https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop), a store for Google Chrome extensions.
When publishing a new version, I first make a [new release](https://github.com/penge/my-notes/releases) here on GitHub.
Then I create a build of the new release and send it to Web Store for a review.
The review usually takes between 24 hours and a few days.
After a successful review, the new version is available on Web Store.

<br>

**2. Can I install My Notes manually by downloading it from GitHub?**

Yes, My Notes can be installed manually by downloading it from GitHub, but keep in mind, that Google Drive Sync works only if My Notes is installed from [Web Store]((https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop)).
To install My Notes manually, download the zip file of the latest version which you can find [here](https://github.com/penge/my-notes/releases). Then, unpack the downloaded file and install NPM packages followed by `npm run build`.
Finally, open `chrome://extensions` address in Google Chrome and click the **"Load unpacked"** button to load the unpacked extension from your drive by selecting the `out` directory.

<br>

**3. Google Drive Sync isn't working. What's the cause?**

Google Drive Sync works only if My Notes is installed from Web Store and in Google Chrome.
The reasons for this are two.
First, Google Chrome provides an "identity" API that My Notes relies on.
Second, for security reasons, Google Drive Sync works only if My Notes has an ID equal to **"lkeeogfaiembcblonahillacpaabmiop"**, which is the ID it has on Web Store (also in the URL).
When My Notes is installed manually, it gets an ID that is different to the one on Web Store.

<br>

**4. What browsers and operating systems are supported?**

Currently, only Google Chrome is supported.
Other Chromium-based browsers are next to come, if possible.
Any common OS (Windows, Linux, OSX) is supported.
Chromebooks are supported as well.

<br>

**5. How can I open or edit notes from my phone?**

If Google Drive Sync is enabled, My Notes will sync your notes to/from your personal Google Drive into a folder **"My Notes"**.

To get access to your Google Drive from a phone, install Google Drive application.
To open the note, click on in from the list.
To edit the note, click on the three-circles icon next to the note, and select "Open with" from the context menu.
You can then chose a preferred editor from the list.

<br>

**6. What is the size limit for my notes?**

Notes are limited to 5MB in total.

This limit comes with the default setting of the browser.
In case of interest, future versions of My Notes could be having a new optional **"unlimitedStorage"** permission, which if enabled, would increase the storage infinitely (as your hard drive allows).

<br>

**7. Is My Notes for free?**

My Notes is available as open-source, free to download, install, and use.
Preferred way to install My Notes is from [Web Store](https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop).

<br><br>

---

<p align="center"><code>Created with ❤ in 2019.</code></p>
