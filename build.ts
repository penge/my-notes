import fs from "fs";
import esbuild from "esbuild";

esbuild.build({
  entryPoints: [
    "./src/background.ts",
    "./src/notes.tsx",
    "./src/options.tsx",
    "./src/themes/custom/custom.tsx",
    "./src/themes/init.ts",
    ...(process.env.NODE_ENV === "development" ? ["./src/integration/index.ts"] : []),
  ],
  chunkNames: "chunks/[name]-[hash]",
  bundle: true,
  outdir: "./dist",
  outExtension: { ".js": ".mjs" },
  splitting: true,
  format: "esm",
  define: {
    "process.env.LOG_LEVEL": '"ALL"',
  },
  loader: {
    ".svg": "text",
  },
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
  logLevel: "info",
}).then(() => {
  const templateString = fs.readFileSync("./src/template.html", "utf8");
  ["notes", "options"].forEach((page) => {
    fs.writeFileSync(`./dist/${page}.html`, templateString.replaceAll("{{page}}", page));
  });
});
