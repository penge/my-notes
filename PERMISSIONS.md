# Permissions

They are listed in [**manifest.json**](manifest.json) and can be organized into two groups — **required** and **optional**.

<br>

## Required

Required permissions are needed at all times. These are:

- **"storage"** — required to save the notes and options (font type, font size, etc.) to _Chrome Storage_

- **"contextMenus"** — required to create _My Notes Context menu_

<br>

## Optional

Optional permissions are needed only when enabling additional functionality, that depends on one or more such permissions. These are:

- **"tabs"** — required by **Open My Notes in every New Tab** (see **Options**)

- **"identity"** — required by **Enable Google Drive Sync** (see **Options**)

**"tabs"** is a more powerful permission — the displayed warning may contain an unrelated message — `It can: Read your Browsing history`.
