interface KeyboardShortcut {
  description: string
  mac: string
  other: string
  configurable?: boolean
  hold?: boolean
}

const keyboardShortcuts: KeyboardShortcut[] = [
  {
    description: "Open My Notes",
    mac: "⌘ + Shift + M",
    other: "Ctrl + Shift + M",
    configurable: true,
  },
  {
    description: "Open Options",
    mac: "⌘ + Shift + O",
    other: "Ctrl + Shift + O",
  },
  {
    description: "Sync notes to and from Google Drive",
    mac: "⌘ + R",
    other: "Ctrl + R",
  },
  {
    description: "Open Command palette",
    mac: "⌘ + P",
    other: "Ctrl + P",
  },
  {
    description: "Repeat last command",
    mac: "⌘ + Shift + P",
    other: "Ctrl + Shift + P",
  },
  {
    description: "Toggle Focus mode",
    mac: "⌘ + Shift + F",
    other: "Ctrl + Shift + F",
  },
  {
    description: "Toggle Sidebar",
    mac: "⌘ + S",
    other: "Ctrl + S",
  },
  {
    description: "Toggle Toolbar",
    mac: "⌘ + E",
    other: "Ctrl + E",
  },
  {
    description: "Open previous note",
    mac: "⌘ + [",
    other: "Alt + Left",
  },
  {
    description: "Open next note",
    mac: "⌘ + ]",
    other: "Alt + Right",
  },
  {
    description: "Open note on mouse hover",
    mac: "⌘",
    other: "Ctrl",
    hold: true,
  },
  {
    description: "Open link in a New Tab",
    mac: "⌘ + Click",
    other: "Ctrl + Click",
  },
  {
    description: "Open link in a New Tab and make it active",
    mac: "⌘ + Shift + Click",
    other: "Ctrl + Shift+ Click",
  },
  {
    description: "Close",
    mac: "Esc",
    other: "Esc",
  },
  {
    description: "Confirm",
    mac: "Enter",
    other: "Enter",
  },
  {
    description: "Bold",
    mac: "⌘ + B",
    other: "Ctrl + B",
  },
  {
    description: "Italic",
    mac: "⌘ + I",
    other: "Ctrl + I",
  },
  {
    description: "Underline",
    mac: "⌘ + U",
    other: "Ctrl + U",
  },
  {
    description: "Strikethrough",
    mac: "⌘ + Shift + X",
    other: "Alt + Shift + 5",
  },
  {
    description: "Remove Formatting",
    mac: "⌘ + \\",
    other: "Ctrl + \\",
  },
  {
    description: "Bulleted List",
    mac: "⌘ + Shift + 7",
    other: "Ctrl + Shift + 7",
  },
  {
    description: "Numbered List",
    mac: "⌘ + Shift + 8",
    other: "Ctrl + Shift + 8",
  },
  {
    description: "Current date",
    mac: "⌘ + ;",
    other: "Ctrl + ;"
  },
  {
    description: "Current time",
    mac: "⌘ + Shift + ;",
    other: "Ctrl + Shift + ;"
  },
  {
    description: "Current date and time",
    mac: "⌘ + Shift + Option + ;",
    other: "Ctrl + Shift + Alt + ;"
  },
];

export default keyboardShortcuts;
