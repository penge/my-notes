# My Notes

My Notes is a Chrome Extension that turns your **New Tab** into a note-taking tool.

- Great for Notes, Todos, and sharing text (Copy/Paste)

- It works immediately after you click My Notes icon (located in toolbar)

- Every edit and paste is saved (and waiting for you once you come back)

- And! It is Synchronized across every Chrome window you have open

<br>

## My Notes

![My Notes](image.png)

My Notes can be open with **1 click on the icon.**

Font in the picture above is **Courier Prime** and is available via **Google Fonts.**
Font can be easily changed in **Options.**

<br>

## Options

Options can be open with a click on Options link (in the bottom panel of My Notes),
or with a right-click on My Notes icon (in the browser's toolbar) and selecting Options.

**Options allow you to:**

- set Font type (Serif, Sans Serif, Monospace, Google Fonts)
- set Font size (using the slider)
- change the color mode (light mode or dark mode)
- see Keyboard Shortcuts that you may use (Windows, Linux, Mac)
- set Focus mode (can be set explicitly using the checkbox, or can be also changed with a keyboard shortcut)
- see the ways of contacting me if needed
- see the installed version number

<br>

## Context menu

After selecting a text on a website, you can use the context menu (right click)
to save the selection to My Notes.

<br>

![Context Menu](context-menu.png)


Available options:

- **Save selection** to save the selection to your computer
- **Save selection to other devices** to save the selection to your other computer(s)
where you are logged in with the same Google Account

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

My Notes are stored in your browser using `Chrome Storage Local` and `Chrome Storage Sync`.
`localStorage` is used to optimize saving.

If you accidentally uninstall My Notes extension, data will be lost. Consider doing a backup first.

In future, My Notes can be stored in Google Drive which is a higly anticipated feature.
This would allow to have remote backups and revisions.

<br>

## Permissions

As My Notes is an extension, it relies on permissions that must be granted by you in order to work.

My Notes relies on very simple permissions that are called "storage" and "contextMenus".
As their name suggests, "storage" permission is required to save My Notes using Chrome Storage.
The second one, "contextMenus", is a permission used to create Context menu.
