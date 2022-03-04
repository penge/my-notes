require("esbuild").build({
  entryPoints: [
    "./src/background.ts",
    "./src/notes.tsx",
    "./src/options.tsx",
    "./src/themes/custom/custom.tsx",
    ...(process.env.NODE_ENV === "development" ? ["./src/integration/index.ts"] : []),
  ],
  bundle: true,
  define: {
    "process.env.LOG_LEVEL": '"ALL"',
  },
  loader: {
    ".svg": "text",
  },
  minify: process.env.NODE_ENV === "production",
  outdir: "./out",
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
  logLevel: "info"
});
