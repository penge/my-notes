/* global console */

import elem from "../elements.js";

import { initiate, stop, sync } from "../../sync/index.js";

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
