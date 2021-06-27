if (process.env.NODE_ENV === "production" && !process.env.MY_NOTES_AUTHOR_EMAIL) {
  const BOLD = "\x1b[1m";
  const RED = "\x1b[31m";
  console.log(`${BOLD}${RED}MY_NOTES_AUTHOR_EMAIL is required in production!`);
  process.exit(1);
}

require("esbuild").build({
  entryPoints: [
    "./src/background.ts",
    "./src/notes.tsx",
    "./src/options.tsx",
    "./src/themes/custom/custom.ts",
    ...(process.env.NODE_ENV === "development" ? ["./src/integration/index.ts"] : []),
  ],
  bundle: true,
  define: {
    "process.env.LOG_LEVEL": '"ALL"',
    "process.env.MY_NOTES_AUTHOR_EMAIL": process.env.MY_NOTES_AUTHOR_EMAIL ? `"${process.env.MY_NOTES_AUTHOR_EMAIL}"` : '"example@example.com"',
  },
  loader: {
    ".svg": "text",
  },
  minify: process.env.NODE_ENV === "production",
  outdir: "./out",
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
  logLevel: "info"
});
