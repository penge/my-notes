import { withPermission } from "shared/permissions";
import * as api from "background/google-drive/api";
import { initiate, sync, stop } from "background/google-drive/sync";
import elem from "./elements";

let folderId: string;
let fileId: string;

const withFolder = () => {
  if (!folderId) { console.log("folderId not set"); }
  return folderId;
};

const withFile = () => {
  if (!fileId) { console.log("fileId not set"); }
  return fileId;
};

const withIdentity = withPermission("identity");

/* === Folder === */

export const initFolderActions = (): void => window.addEventListener("load", () => {
  elem.createMyNotesFolder.addEventListener("click", async () => {
    withIdentity(async () => {
      folderId = await api.createMyNotesFolder();
      console.log("folderId", folderId);
    });
  });

  elem.getMyNotesFolderId.addEventListener("click", async () => {
    withIdentity(async () => {
      folderId = await api.getMyNotesFolderId();
      console.log("folderId", folderId);
    });
  });
});

/* === Files === */

let counter = 0;

export const initFileActions = (): void => window.addEventListener("load", () => {
  elem.createFile.addEventListener("click", async () => {
    if (withFolder()) {
      withIdentity(async () => {
        counter += 1;
        const time = new Date().toISOString();
        const file = await api.createFile(folderId, {
          name: `Todo ${counter}`,
          content: "buy milk",
          createdTime: time,
          modifiedTime: time,
        });
        console.log("file", file);
        fileId = file.id;
      });
    }
  });

  elem.updateFile.addEventListener("click", async () => {
    if (withFile()) {
      withIdentity(async () => {
        const time = new Date().toISOString();
        const file = await api.updateFile(fileId, {
          name: "Todo Today",
          content: "buy milk, buy coffee",
          modifiedTime: time,
        });
        console.log("file", file);
        fileId = file.id;
      });
    }
  });

  elem.deleteFile.addEventListener("click", async () => {
    if (withFile()) {
      withIdentity(async () => {
        await api.deleteFile(fileId);
        console.log("fileId", fileId);
      });
    }
  });

  elem.listFiles.addEventListener("click", async () => {
    if (withFolder()) {
      withIdentity(async () => {
        const files = await api.listFiles(folderId);
        console.log(files);
      });
    }
  });

  elem.getFile.addEventListener("click", async () => {
    if (withFile()) {
      withIdentity(async () => {
        const file = await api.getFile(fileId);
        console.log(file);
      });
    }
  });
});

/* === Backup === */

export const initBackupActions = (): void => window.addEventListener("load", () => {
  elem.initiate.addEventListener("click", async () => {
    const result = await initiate();
    console.log("result", result);
  });

  elem.sync.addEventListener("click", async () => {
    const result = await sync();
    console.log("result", result);
  });

  elem.stop.addEventListener("click", async () => {
    const result = await stop();
    console.log("result", result);
  });
});
