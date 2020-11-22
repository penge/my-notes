/**
 * Notes that cannot be renamed or deleted
 */
const reserved = [
  "Clipboard",
];

export const isReserved = (noteName: string): boolean => reserved.includes(noteName);
