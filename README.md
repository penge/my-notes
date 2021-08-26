<p align="center"></p>
<h1 align="center">My Notes</h1>
<p align="center">
  <img src="https://badgen.net/github/release/penge/my-notes" />
  <img src="https://badgen.net/github/license/penge/my-notes" />
  <img src="https://badgen.net/chrome-web-store/users/lkeeogfaiembcblonahillacpaabmiop" />
  <br><br>
  <img src="static/images/my-notes.png" width="760" /><br>
  <strong>My Notes</strong> – <a href="https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop">Chrome extension</a> for simple and fast note-taking
</p>

<br><br>

## Features

→ &nbsp; Automatically saved and updated in every open tab ([<ins>How to open</ins>](#how-to-open))

→ &nbsp; Context menu to save selected text to note or My Notes in second computer ([<ins>Context menu</ins>](#context-menu))

→ &nbsp; Back up notes to Google Drive ([<ins>Google Drive Sync</ins>](#google-drive-sync))

→ &nbsp; Sync notes between My Notes and Google Drive, edit them from other devices or My Notes ([<ins>Google Drive Sync</ins>](#google-drive-sync))

→ &nbsp; Auto Sync notes to Google Drive ([<ins>Google Drive Sync</ins>](#google-drive-sync))

→ &nbsp; Drag and drop image with automatic image upload to Google Drive ([<ins>Google Drive Sync</ins>](#google-drive-sync))

→ &nbsp; Toolbar (**Bold**, _Italic_, <ins>Underline</ins>, etc.)

→ &nbsp; Themes (Light, Dark, Custom)

→ &nbsp; Keyboard shortcuts

→ &nbsp; Command palette ([<ins>Command palette</ins>](#command-palette))

→ &nbsp; Works offline

<br>

## How to open

**My Notes:**

<ol type="A">
  <li>Click on My Notes icon in Chrome Toolbar (pin the icon for quick access)</li>
  <li>Use keyboard shortcut (see <code>chrome://extensions/shortcuts</code>)</li>
</ol>

**Options:**

<ol type="A">
  <li>Click on gear icon in bottom left corner</li>
  <li>Right-click on the pinned icon in Chrome Toolbar and select Options</li>
  <li>Click on three-dots icon next to My Notes in Chrome Toolbar and select Options</li>
  <li>Use keyboard shortcut (see Options)</li>
</ol>

<br><br>

## Context menu

Context menu allows you to quickly save selected text from any website to My Notes, or to transfer selected text to My Notes in another computer.

To use Context menu, select the text on website, right-click and see "My Notes" Context menu.

Context menu has these options:

- `Save to [note name]` – Option for every note. As you create new notes, they are automatically added to the list. My Notes doesn't have to be open. Google Drive Sync is not required.
- `Save to remotely open My Notes` – My Notes in another computer needs to be open. The same Google Account needs to be used. Google Drive Sync is not required. The destination note to save the text will be named **"@Received"** (created automatically if it doesn't exist, otherwise updated).

<br><br>

## Custom theme

Custom theme allows you to customize My Notes styles in many ways.

To use a Custom theme, open Options, select **"Custom"** theme, and click on the **"Customize"** button to start creating your own theme.

To start, paste into the editor content of [<ins>light.css</ins>](static/themes/light.css) or [<ins>dark.css</ins>](static/themes/dark.css).
Then, modify CSS variables as you like to change background colors, text colors, etc.
You can add any valid CSS as well to make further changes.
Click on the **"Save"** button to save the custom theme.

<br><br>

## Command palette

Command palette is a window which you can open with `Cmd + P` (or `Ctrl + P`) and use your keyboard to quickly perform any of the following actions:

<ol type="A">
  <li>Find note(s) <b>by their name,</b> and open one. (default behavior)</li>
  <li>Find note(s) <b>by their content,</b> and open one. (type <code>?</code> first, then continue)</li>
  <li>Find <b>commands,</b> and execute one. (type <code>></code> first, then continue)</li>
</ol>

To navigate between the results, use `Up` and `Down` arrow keys.

To open a selected note or execute a selected command, press `Enter`.

The last executed command can be repeated with `Cmd + Shift + P` (or `Ctrl + Shift + P`).

<br><br>

## Google Drive Sync

Google Drive Sync (see Options) saves your notes to your personal Google Drive and synchronizes the changes between your local My Notes and your Google Drive every time you click on the "Sync now" button (bottom left corner).

**Why sync:**

- Having a backup of your notes (notes can be restored)
- Can edit notes from other sources (Google Drive, My Notes, vice versa)
- Can sync notes and edit them from other computers (by installing My Notes and using the same Google Account)

### Location

Notes are uploaded to your Google Drive under the folder "My Notes". This folder is created automatically.
If the folder exists from a previous installation, notes are downloaded and uploaded and the synchronization continues.

### Synchronization

Synchronization works both ways — to Google Drive, from Google Drive.

Notes are synchronized every time you click on the "Sync now" button.
While the synchronization is in progress, "Sync now" button will spin.
"Sync now" button has a tooltip that shows the time of the most recent synchronization.

### Auto Sync

Auto Sync (see Options) can automatically sync your notes to and from Google Drive every time you open My Notes, and every 6 seconds if your local notes were updated since the last sync.

### Image upload

When Google Drive Sync is enabled and having an internet connection, you can Drag and Drop one image at a time into a note. Each image is immediately uploaded to your Google Drive under "My Notes" / "assets" folder, which is created automatically.

### Access

My Notes can only access the folder "My Notes" it created, and files it created inside this folder.
It cannot see, access nor modify, any other files in your Google Drive.

<br><br>

## Tips and tricks

1. Set a keyboard shortcut to quickly open My Notes (for example `Cmd + Shift + M`), which you can set on this page `chrome://extensions/shortcuts`. If you make the keyboard shortcut Global, it will open My Notes even if Google Chrome is closed.
2. Check keyboard shortcuts (open Options) on how to quickly do some actions.
3. Hold down the Shift key (`Cmd + Shift + V`) to paste text in a plain format (without styles).
4. Hide Toolbar and Sidebar if you prefer a simple interface.
5. See [<ins>Google Fonts</ins>](https://fonts.google.com) for a font you like, write its name into My Notes Options to use it.
6. Note name is present in the URL, therefore you can save it to bookmarks for quick access. If you append saved URL with `&focus`, it will always open that note in Focus mode.
7. Use [<ins>Context menu</ins>](#context-menu) to transfer selected text to My Notes in another computer(s).
8. Use [<ins>Custom theme</ins>](#custom-theme) to customize the look of My Notes in any way needed.
9. Drag and Drop selected text onto a note's name in the Sidebar to insert the text into the note.
10. Drag and Drop a TXT file anywhere in the bottom part of the Sidebar (area with 3 icons) to import the file as a new note.
11. Drag the Sidebar line to resize the Sidebar, double-click on the Sidebar line to restore the original Sidebar width.

<br><br>

## How to contribute

1. Share your feedback (what to improve, what to change) under [<ins>Issues</ins>](https://github.com/penge/my-notes/issues) or join the discussion in [<ins>Discussions</ins>](https://github.com/penge/my-notes/discussions).
2. Join the development.
3. Help to test the upcoming version (to get feedback, to improve or tweak).
4. Help to improve the documentation.
5. [<ins>Buy Me a Coffee</ins>](https://www.buymeacoffee.com/penge).

<br><br>

## How to develop

Develop:

```
$ npm install
$ export MY_NOTES_CLIENT_ID=<CLIENT_ID>    # needed when developing Google Drive Sync
$ npm run develop-watch                    # see "out" folder
```

`MY_NOTES_CLIENT_ID` can be created at [<ins>Google Cloud</ins>](https://console.cloud.google.com) / APIs & Services / Credentials / OAuth 2.0 Client IDs.

Code check:

```
$ npm run lint
```

Tests:

```
$ npm test
```

Build:

```
$ npm run build   # see "out" folder
```

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

- `"storage"` — used to save your notes and options to Chrome Storage (locally in your Chrome)
- `"unlimitedStorage"` — used to increase the default storage limit (which is 5MB)
- `"contextMenus"` — used to create My Notes Context menu

Required permissions are shown to the user before installing the extension, and are needed at all times to provide the basic functionality.

**Optional:**

- `"identity"` — needed for "Enable Google Drive Sync" (see Options)

Optional permissions are needed only to provide additional functionality that can be enabled via a checkbox in Options.

User has the choice to either approve or deny the permissions.

<br><br>

## QA

**1. Where is My Notes published? What is the process behind publishing My Notes?**

My Notes is published on [<ins>Web Store</ins>](https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop), a store for Google Chrome extensions.
When publishing a new version, I first make a [<ins>new release</ins>](https://github.com/penge/my-notes/releases) here on GitHub.
Then I create a build of the new release and send it to Web Store for a review.
The review usually takes between 24 hours and a few days.
After a successful review, the new version is available on Web Store.

<br>

**2. Can I install My Notes manually by downloading it from GitHub?**

Yes, My Notes can be installed manually by downloading it from GitHub, but keep in mind, that Google Drive Sync works only if My Notes is installed from [<ins>Web Store</ins>](https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop).
To install My Notes manually, download the zip file of the latest version which you can find [<ins>here</ins>](https://github.com/penge/my-notes/releases). Then, unpack the downloaded file and install NPM packages followed by `npm run build`.
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

Notes are _NOT_ limited in size due to the used `"unlimitedStorage"` permission.

<br>

**7. (Google Drive) Where are images uploaded?**

Images are uploaded to your personal Google Drive under the folder My Notes / assets. Folder **"assets"** is created automatically when needed.

<br>

**8. (Google Drive) Are images stored privately?**

Yes. Only you can see the images. If you'd like to share the image(s) publicly or to someone specific, see **Share** button in Google Drive.

<br>

**9. (Google Drive) Are images deleted from my Google Drive after I remove them from a note?**

No. Images continue to be stored in your Google Drive for future uses. This way images don't have to be uploaded again.
If you'd like to delete the image permanently, go to Google Drive to delete the image.

<br>

**10. (Google Drive) How can I insert the once uploaded image after I have removed it from a note?**

Go to your Google Drive, see the image you'd like to insert, right-click on the image and click on "Get link".
Copy the link and paste to My Notes using the "Insert Image" button.

<br>

**11. Is My Notes for free?**

My Notes is available as open-source, free to download, install, and use.
Preferred way to install My Notes is from [<ins>Web Store</ins>](https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop).

<br><br>

---

<p align="center"><code>Created with ❤ in 2019.</code></p>
