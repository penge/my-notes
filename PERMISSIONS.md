# Permissions

My Notes needs permissions to provide the required functionality.

These permissions are listed in [**manifest.json**](manifest.json):

- **"storage"** – required to save notes and options (font type, font size, etc.) to Chrome Storage

- **"contextMenus"** – required to create Context menu

- **"tabs"** – required to open My Notes in every new tab, if enabled

Among these permissions, **"tabs"** requires to be granted when you click
**"Open in every new tab"** in Options.

Because **"tabs"** is a more powerful permission, the displayed warning
may contain an unrelated message – `It can: Read your Browsing history`.

Do not panic. My Notes really doesn't read your browsing history.
The message just comes with the permission and cannot be changed.
