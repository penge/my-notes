export const normalizeFilter = (filter: string): string => filter.trim().toLowerCase().replace(/^(>)\s*(.*)/, "$1 $2");
export const isCommandFilter = (filter: string): boolean => filter.startsWith(">");
