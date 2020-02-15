/**
 * Notes that cannot be renamed or deleted
 *
 * They have as well a different color to be easily recognized
 * See notes.css => .reserved
 */
const reserved = [
  "Clipboard",
];

export const isReserved = noteName => reserved.includes(noteName);
