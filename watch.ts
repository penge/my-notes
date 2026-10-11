import { execSync } from "child_process";
import chokidar from "chokidar";

const run = (command: string) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch {
    // The failing command already printed its error; keep watching.
  }
};

// Events arrive in bursts (editors often emit several per save), so collect
// them and act once per burst: one rebuild, one copy per changed public file.
let rebuild = false;
const copy = new Set<string>();
let timer: NodeJS.Timeout | undefined;

const flush = () => {
  if (rebuild) {
    run("npm run __develop-core");
  }
  copy.forEach((path) => run(`npx copyup ${path} dist`));
  rebuild = false;
  copy.clear();
};

chokidar.watch(["src", "public"], { ignoreInitial: true }).on("all", (event, path) => {
  if (path.startsWith("src") && /\.(ts|tsx|json)$/.test(path) && ["add", "change", "unlink"].includes(event)) {
    rebuild = true;
  }

  if (path.startsWith("public") && /\.(html|css)$/.test(path) && ["add", "change"].includes(event)) {
    copy.add(path);
  }

  clearTimeout(timer);
  timer = setTimeout(flush, 400);
});
