/**
 * Notes that cannot be renamed or deleted
 */
const reserved = [
  "Clipboard",
];

export const isReserved = noteName => reserved.includes(noteName);
