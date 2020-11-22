import elem from "./elements";

import { initiate, stop, sync } from "background/google-drive/sync/index";

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
