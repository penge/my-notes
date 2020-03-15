# My Notes

**My Notes** is a _Chrome Extension_ that turns your **New Tab** into a note-taking app.

- It is great for writing down notes, todos, thoughts, and adding a temporary text (Copy/Paste)

- It works immediately after you click My Notes icon (located in the browser's toolbar)
and it can be open in every new tab if enabled (see **Options**)

- Every edit and paste is saved and ready when you come back

- Every edit is synchronized in other windows you have open

- **Context menu** can be used to send a text to your other computers if using
the same Google Account and having My Notes open

<br>

## My Notes

![My Notes](image.png)

My Notes can be open with 1 click on the icon (located in the browser's toolbar)
or it can be open in every new tab if enabled (see **Options**).

The font used in the picture above is **Courier Prime**, available via **Google Fonts**.
See **Options** to change the font.

<br>

## Options

Options can be open with a click on Options link (in the bottom panel of My Notes), or with a right-click on My Notes icon (in the browser's toolbar) and selecting Options.

**Options allow you to:**

- set Font type (Serif, Sans Serif, Monospace, Google Fonts)
- set Font size (using the slider)
- change the color mode (light mode or dark mode)
- see Keyboard Shortcuts that you may use (Windows, Linux, Mac)
- enable Focus mode (can be enabled with a checkbox, or toggled with a keyboard shortcut)
- open My Notes in every new tab if granted (see [**Permissions**](PERMISSIONS.md))
- see the version number and what's new
- see the important resources – Support, Contributing, Permissions, Repository

<br>

## Context menu

After selecting a text on a website, you can right-click and use My Notes Context menu to save the selection to My Notes.

<br>

![Context Menu](context-menu.png)

Available options:

- **Save selection** to save the selection to My Notes in the current computer
- **Save selection to other devices** to save the selection to My Notes in your other computer(s) where you are logged-in under the same Google Account and have My Notes open

<br>

Saved selection is added to the top of **page 1** in the following format:

```
// URL (where the text comes from)
TEXT
```

<br>

## Installation

My Notes can be installed from **Web Store** (preferred):

https://chrome.google.com/webstore/detail/my-notes/lkeeogfaiembcblonahillacpaabmiop

<br>

My Notes can be installed manually:

1. Click on **"Clone or download"** and then **"Download ZIP"**
2. Extract the downloaded **ZIP**
3. In Chrome, go to **Extensions** from the menu or visit [chrome://extensions](chrome://extensions) from a new tab
4. In Chrome Extensions, click the **"Load unpacked"** button
5. Navigate to the plugin folder (from the second step) and click the **"Open"** button

<br>

## Storage

My Notes is stored in:

- **Chrome Storage**, which comes down to:
  - **Chrome Storage Local** as a storage for notes and options (font type, font size, etc.), limited to 5MB
  - **Chrome Storage Sync** as a storage for the text saved by My Notes Context Menu -> **Save selection to other devices**, limited to 100KB

- **localStorage** to optimize the saving of notes

Notes are saved every **1 second** if changed.

If you accidentally uninstall My Notes extension and don't have a backup, data will be lost.
Consider doing a backup first.

Version 3.0 will introduce **Google Drive** backup as a prevention to data loss.
If enabled, My Notes can have an ongoing backup to your Google Drive.

<br>

## Resources

- [**Support**](SUPPORT.md)
- [**Contributing**](CONTRIBUTING.md)
- [**Permissions**](PERMISSIONS.md)
- **Repository** – you are right here
